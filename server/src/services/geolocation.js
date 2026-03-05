const axios = require('axios');
const dns = require('dns').promises;

class GeolocationService {
  // ดึง IP address จาก domain
  async getIPFromDomain(domain) {
    try {
      const addresses = await dns.resolve4(domain);
      return addresses[0]; // เอา IP แรก
    } catch (error) {
      console.error('DNS lookup error:', error.message);
      return null;
    }
  }

  // ดึงข้อมูล Geolocation
  async getGeolocation(ip) {
    try {
      // ใช้ ipapi.co (ฟรี)
      const response = await axios.get(`https://ipapi.co/${ip}/json/`, {
        timeout: 5000
      });

      const data = response.data;

      return {
        ip: ip,
        country: data.country_name || 'Unknown',
        countryCode: data.country_code || 'XX',
        city: data.city || 'Unknown',
        region: data.region || '',
        latitude: data.latitude || 0,
        longitude: data.longitude || 0,
        timezone: data.timezone || '',
        organization: data.org || 'Unknown',
        asn: data.asn || ''
      };
    } catch (error) {
      // Fallback: ใช้ ip-api.com
      try {
        const fallbackResponse = await axios.get(`http://ip-api.com/json/${ip}`, {
          timeout: 5000
        });

        const data = fallbackResponse.data;

        return {
          ip: ip,
          country: data.country || 'Unknown',
          countryCode: data.countryCode || 'XX',
          city: data.city || 'Unknown',
          region: data.regionName || '',
          latitude: data.lat || 0,
          longitude: data.lon || 0,
          timezone: data.timezone || '',
          organization: data.isp || 'Unknown',
          asn: data.as || ''
        };
      } catch (fallbackError) {
        console.error('Geolocation error:', fallbackError.message);
        return {
          ip: ip,
          country: 'Unknown',
          countryCode: 'XX',
          city: 'Unknown',
          region: '',
          latitude: 0,
          longitude: 0,
          timezone: '',
          organization: 'Unknown',
          asn: ''
        };
      }
    }
  }

  // ดึงข้อมูลจาก URL
  async getLocationFromURL(url) {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname;

      // ดึง IP
      const ip = await this.getIPFromDomain(domain);
      
      if (!ip) {
        return null;
      }

      // ดึง geolocation
      const geoData = await this.getGeolocation(ip);

      return geoData;
    } catch (error) {
      console.error('Location lookup error:', error.message);
      return null;
    }
  }

  // ดึง flag emoji จาก country code
  getFlagEmoji(countryCode) {
    if (!countryCode || countryCode === 'XX') return '🏳️';
    
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt());
    
    return String.fromCodePoint(...codePoints);
  }
}

module.exports = new GeolocationService();
