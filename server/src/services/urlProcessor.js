const axios = require('axios');
const validator = require('validator');

// รายชื่อเว็บลิงก์ย่อ
const URL_SHORTENERS = [
  'bit.ly', 'bitly.com', 'tinyurl.com', 'goo.gl', 'ow.ly', 't.co',
  'buff.ly', 'is.gd', 'bl.ink', 'cutt.ly', 'short.io', 'rebrand.ly',
  's.id', 'tiny.cc', 'cli.gs', 'gg.gg', 'u.nu', 'lnkd.in',
  'yourls.org', 'rb.gy', 'shorturl.at', 'clck.ru', 'urlz.fr'
];

class URLProcessor {
  // ตรวจสอบและแก้ไข URL
  normalizeURL(input) {
    let url = input.trim();
    
    // เติม https:// ถ้าไม่มี protocol
    if (!url.match(/^https?:\/\//i)) {
      url = 'https://' + url;
    }
    
    return url;
  }

  // ตรวจสอบว่า URL ถูกต้องหรือไม่
  isValidURL(url) {
    try {
      const normalized = this.normalizeURL(url);
      return validator.isURL(normalized, {
        protocols: ['http', 'https'],
        require_protocol: true
      });
    } catch (error) {
      return false;
    }
  }

  // ตรวจสอบว่าเป็นลิงก์ย่อหรือไม่
  isShortURL(url) {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.replace('www.', '');
      
      return URL_SHORTENERS.some(shortener => 
        domain === shortener || domain.endsWith('.' + shortener)
      );
    } catch (error) {
      return false;
    }
  }

  // แก้ลิงก์ย่อ (unshorten)
  async unshortenURL(url, maxRedirects = 5) {
    try {
      const response = await axios.head(url, {
        maxRedirects: maxRedirects,
        timeout: 10000,
        validateStatus: (status) => status < 400
      });

      // ดึง URL สุดท้ายหลังจาก redirect
      const finalURL = response.request.res.responseUrl || url;
      
      return {
        success: true,
        originalURL: url,
        finalURL: finalURL,
        wasShortened: finalURL !== url
      };
    } catch (error) {
      // ถ้า HEAD ไม่ได้ ลอง GET
      try {
        const response = await axios.get(url, {
          maxRedirects: maxRedirects,
          timeout: 10000,
          maxContentLength: 1024, // จำกัดขนาด
          validateStatus: (status) => status < 400
        });

        const finalURL = response.request.res.responseUrl || url;
        
        return {
          success: true,
          originalURL: url,
          finalURL: finalURL,
          wasShortened: finalURL !== url
        };
      } catch (getError) {
        console.error('Error unshortening URL:', getError.message);
        return {
          success: false,
          originalURL: url,
          finalURL: url,
          wasShortened: false,
          error: getError.message
        };
      }
    }
  }

  // ดึง domain จาก URL
  extractDomain(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch (error) {
      return null;
    }
  }

  // Process URL ทั้งหมด
  async processURL(input) {
    // 1. Normalize URL
    const normalized = this.normalizeURL(input);
    
    // 2. Validate
    if (!this.isValidURL(normalized)) {
      throw new Error('Invalid URL format');
    }

    // 3. ตรวจสอบว่าเป็นลิงก์ย่อหรือไม่
    const isShort = this.isShortURL(normalized);
    
    let finalURL = normalized;
    let wasShortened = false;

    // 4. ถ้าเป็นลิงก์ย่อ ให้แก้ไข
    if (isShort) {
      const unshortened = await this.unshortenURL(normalized);
      if (unshortened.success) {
        finalURL = unshortened.finalURL;
        wasShortened = unshortened.wasShortened;
      }
    }

    return {
      originalInput: input,
      normalizedURL: normalized,
      finalURL: finalURL,
      wasShortened: wasShortened,
      domain: this.extractDomain(finalURL)
    };
  }
}

module.exports = new URLProcessor();
