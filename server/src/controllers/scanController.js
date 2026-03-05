const urlProcessor = require('../services/urlProcessor');
const virusTotalService = require('../services/virustotal');
const geolocationService = require('../services/geolocation');
const whoisService = require('../services/whois');
const cacheService = require('../services/cache');
const ScanHistory = require('../models/ScanHistory');
const DangerousUrl = require('../models/DangerousUrl');
const ipHelper = require('../utils/ipHelper');

class ScanController {
  async scanURL(req, res, next) {
    try {
      const { url } = req.body;

      if (!url) {
        return res.status(400).json({
          success: false,
          error: { message: 'URL is required' }
        });
      }

      // ดึง IP ของผู้ใช้
      const userIP = ipHelper.getUserIP(req);
      const normalizedUserIP = ipHelper.normalizeIP(userIP);

      // 1. Process URL (ตรวจสอบและแก้ลิงก์ย่อ)
      const processedURL = await urlProcessor.processURL(url);

      // 2. ตรวจสอบ cache ก่อน
      const cacheKey = cacheService.generateKey(processedURL.finalURL);
      const cachedResult = cacheService.get(cacheKey);

      if (cachedResult) {
        console.log('📦 Cache hit for:', processedURL.finalURL);
        
        // บันทึกประวัติ (ถึงแม้จะได้จาก cache)
        await this.saveScanHistory(normalizedUserIP, processedURL, cachedResult);
        
        return res.json({
          success: true,
          data: {
            ...cachedResult,
            fromCache: true
          }
        });
      }

      // 3. สแกนด้วย VirusTotal
      console.log('🔍 Scanning:', processedURL.finalURL);
      const vtResult = await virusTotalService.scanURL(processedURL.finalURL);

      // 4. ดึงข้อมูล Geolocation
      const geoData = await geolocationService.getLocationFromURL(processedURL.finalURL);

      // 5. ดึงข้อมูล WHOIS
      const whoisData = await whoisService.lookup(processedURL.domain);

      // 6. รวมผลลัพธ์
      const result = {
        url: {
          original: processedURL.originalInput,
          normalized: processedURL.normalizedURL,
          final: processedURL.finalURL,
          domain: processedURL.domain,
          wasShortened: processedURL.wasShortened
        },
        security: {
          score: vtResult.securityScore,
          threatLevel: vtResult.threatLevel,
          isDangerous: vtResult.isDangerous,
          stats: vtResult.stats,
          detectedBy: vtResult.engines
        },
        geolocation: geoData ? {
          ip: geoData.ip,
          country: geoData.country,
          countryCode: geoData.countryCode,
          flag: geolocationService.getFlagEmoji(geoData.countryCode),
          city: geoData.city,
          organization: geoData.organization
        } : null,
        whois: {
          registrar: whoisData.registrar,
          domainAge: whoisData.domainAge,
          domainAgeText: whoisService.formatDomainAge(whoisData.domainAge),
          createdDate: whoisData.createdDate
        },
        scanDate: vtResult.scanDate
      };

      // 7. เก็บใน cache
      cacheService.set(cacheKey, result);

      // 8. บันทึกประวัติ
      await this.saveScanHistory(normalizedUserIP, processedURL, result);

      // 9. ถ้าเป็น URL อันตราย ให้บันทึกใน dangerous_urls
      if (result.security.isDangerous) {
        await DangerousUrl.upsert(
          processedURL.finalURL,
          processedURL.domain,
          result.security.score
        );
      }

      res.json({
        success: true,
        data: {
          ...result,
          fromCache: false
        }
      });

    } catch (error) {
      next(error);
    }
  }

  // บันทึกประวัติการสแกน
  async saveScanHistory(userIP, processedURL, result) {
    try {
      const historyData = {
        userIP: userIP,
        originalInput: processedURL.originalInput,
        scannedURL: processedURL.normalizedURL,
        wasShortened: processedURL.wasShortened,
        finalURL: processedURL.finalURL,
        securityScore: result.security.score,
        isDangerous: result.security.isDangerous,
        threatDetails: JSON.stringify(result.security.detectedBy),
        country: result.geolocation?.country || 'Unknown',
        ipAddress: result.geolocation?.ip || 'Unknown',
        virusTotalData: result.security,
        maliciousCount: result.security.stats.malicious,
        suspiciousCount: result.security.stats.suspicious,
        totalEngines: result.security.stats.total
      };

      await ScanHistory.create(historyData);
    } catch (error) {
      console.error('Error saving scan history:', error);
    }
  }
}

module.exports = new ScanController();
