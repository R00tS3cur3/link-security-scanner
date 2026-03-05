const axios = require('axios');

const VIRUSTOTAL_API_KEY = process.env.VIRUSTOTAL_API_KEY;
const VT_BASE_URL = 'https://www.virustotal.com/api/v3';

class VirusTotalService {
  constructor() {
    if (!VIRUSTOTAL_API_KEY) {
      console.warn('⚠️  VirusTotal API key not found!');
    }

    this.headers = {
      'x-apikey': VIRUSTOTAL_API_KEY,
      'Content-Type': 'application/json'
    };

    // รายชื่อ Engine ที่มีความน่าเชื่อถือสูง
    this.trustedEngines = [
      'Google Safe Browsing',
      'Microsoft Defender SmartScreen',
      'Kaspersky',
      'BitDefender',
      'Sophos',
      'Symantec',
      'Fortinet',
      'Check Point',
      'Avast'
    ];
  }

  // สแกน URL
  async scanURL(url) {
    try {
      // Step 1: ลองดึงผลเก่าจาก VirusTotal cache ก่อน (เร็วมาก)
      const cachedResult = await this.getCachedResult(url);
      if (cachedResult) {
        return cachedResult;
      }

      // Step 2: ถ้าไม่มีผลเก่า ส่ง URL ไปสแกนใหม่
      const scanResponse = await axios.post(
        `${VT_BASE_URL}/urls`,
        `url=${encodeURIComponent(url)}`,
        {
          headers: {
            ...this.headers,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      const analysisId = scanResponse.data.data.id;

      // Step 3: รอผลลัพธ์ (retry หลายครั้ง แต่ลด delay ลง)
      let attempts = 0;
      const maxAttempts = 8;
      const delay = 1500; // ลดจาก 3000ms → 1500ms

      while (attempts < maxAttempts) {
        await this.sleep(delay);

        const result = await this.getAnalysisResult(analysisId);

        if (result.data.attributes.status === 'completed') {
          return this.parseResults(result.data.attributes, url);
        }

        attempts++;
      }

      throw new Error('Scan timeout - please try again');

    } catch (error) {
      if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      if (error.response?.status === 401) {
        throw new Error('Invalid VirusTotal API key');
      }

      throw new Error(error.message || 'VirusTotal scan failed');
    }
  }

  // ดึงผลเก่าจาก VirusTotal cache โดยใช้ URL ID
  async getCachedResult(url) {
    try {
      // VirusTotal ใช้ base64url ของ URL เป็น ID
      const urlId = Buffer.from(url).toString('base64')
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

      const response = await axios.get(
        `${VT_BASE_URL}/urls/${urlId}`,
        { headers: this.headers, timeout: 5000 }
      );

      const data = response.data?.data;
      if (!data) return null;

      const lastAnalysisDate = data.attributes?.last_analysis_date;
      if (!lastAnalysisDate) return null;

      // ใช้ผลเก่าได้ถ้าไม่เกิน 1 ชั่วโมง
      const ageMs = Date.now() - (lastAnalysisDate * 1000);
      if (ageMs > 60 * 60 * 1000) return null;

      console.log('✅ Using cached VirusTotal result');
      return this.parseResults(
        { stats: data.attributes.last_analysis_stats, results: data.attributes.last_analysis_results },
        url
      );
    } catch (err) {
      // ไม่มีผลเก่า หรือ error → ไปสแกนใหม่
      return null;
    }
  }


  // ดึงผลลัพธ์การวิเคราะห์
  async getAnalysisResult(analysisId) {
    try {
      const response = await axios.get(
        `${VT_BASE_URL}/analyses/${analysisId}`,
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // แปลงผลลัพธ์ (Weighted Scoring)
  parseResults(attributes, url) {
    const stats = attributes.stats || {};
    const results = attributes.results || {};

    let weightedScoreSum = 0;
    let totalPossibleWeight = 0;

    // คำนวณด้วยระบบถ่วงน้ำหนัก (Weighted Scoring)
    for (const [engineName, engineResult] of Object.entries(results)) {
      let weight = 1.0;

      // ให้คะแนนความน่าเชื่อถือกับ Engine บางรายการมากกว่าปกติ
      if (this.trustedEngines.some(trusted => engineName.includes(trusted))) {
        weight = 2.5; // Engine ที่น่าเชื่อถือสูงจะมีน้ำหนักคูณไป 2.5
      }

      // สะสมน้ำหนักรวม
      totalPossibleWeight += weight;

      // คำนวณคะแนนตามประเภทของภัยคุกคาม
      if (engineResult.category === 'malicious') {
        weightedScoreSum += (1.0 * weight); // Malicious = 100% ของน้ำหนัก
      } else if (engineResult.category === 'suspicious') {
        weightedScoreSum += (0.4 * weight); // Suspicious = 40% ของน้ำหนัก
      }
    }

    // คำนวณ Weighted Ratio (0-100)
    const ratio = totalPossibleWeight > 0 ? (weightedScoreSum / totalPossibleWeight) * 100 : 0;

    // กำหนดคะแนนและระดับอันตรายจาก ratio ที่คำนวณใหม่
    let securityScore = 0;
    let threatLevel = 'safe';
    let isDangerous = false;

    // ปรับ Threshold ตามระบบถ่วงน้ำหนักใหม่
    if (ratio < 2.5) {
      // 0-2.5% ถือว่าปลอดภัยมาก (มักเป็น Noise จาก Engine เล็กๆ)
      // ปรับให้เป็น 0% เพื่อความสบายใจของผู้ใช้หากความเสี่ยงต่ำมากจริง
      securityScore = 0;
      threatLevel = 'safe';
      isDangerous = false;
    } else if (ratio < 8) {
      // น่าสงสัย
      securityScore = Math.round(20 + ratio * 4); // 20-52
      threatLevel = 'suspicious';
      isDangerous = false;
    } else if (ratio < 20) {
      // อันตราย
      securityScore = Math.round(60 + ratio * 1.5); // 60-90
      threatLevel = 'dangerous';
      isDangerous = true;
    } else {
      // อันตรายมาก
      securityScore = 100;
      threatLevel = 'very_dangerous';
      isDangerous = true;
    }


    const {
      malicious = 0,
      suspicious = 0,
      undetected = 0,
      harmless = 0,
      timeout = 0
    } = stats;

    const total = malicious + suspicious + undetected + harmless + timeout;

    return {
      url: url,
      securityScore: securityScore,
      threatLevel: threatLevel,
      isDangerous: isDangerous,
      stats: {
        malicious,
        suspicious,
        undetected,
        harmless,
        total
      },
      engines: this.extractEngineResults(attributes.results),
      scanDate: new Date().toISOString(),
      rawData: attributes
    };
  }

  // ดึงผลลัพธ์จาก engines
  extractEngineResults(results) {
    if (!results) return [];

    const engines = [];

    for (const [engineName, engineResult] of Object.entries(results)) {
      if (engineResult.category === 'malicious' || engineResult.category === 'suspicious') {
        engines.push({
          name: engineName,
          category: engineResult.category,
          result: engineResult.result
        });
      }
    }

    return engines.slice(0, 10); // เอาแค่ 10 อันดับแรก
  }

  // Helper: sleep
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ตรวจสอบ API key
  async testAPIKey() {
    try {
      await axios.get(`${VT_BASE_URL}/urls/1`, {
        headers: this.headers,
        validateStatus: (status) => status < 500
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = new VirusTotalService();
