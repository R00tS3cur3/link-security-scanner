const axios = require('axios');

class WhoisService {
  // ดึงข้อมูล WHOIS ผ่าน RDAP (ฟรี ไม่ต้อง API key)
  async lookup(domain) {
    try {
      // ใช้ RDAP protocol - มาตรฐานใหม่แทน WHOIS ฟรีและไม่มี rate limit
      const response = await axios.get(
        `https://rdap.org/domain/${domain}`,
        { timeout: 8000 }
      );

      const data = response.data;

      // ดึงวันที่จาก events array
      let createdDate = null;
      let updatedDate = null;
      let expiresDate = null;

      if (data.events) {
        for (const event of data.events) {
          if (event.eventAction === 'registration') createdDate = event.eventDate;
          if (event.eventAction === 'last changed') updatedDate = event.eventDate;
          if (event.eventAction === 'expiration') expiresDate = event.eventDate;
        }
      }

      // ดึง registrar
      let registrar = 'Unknown';
      if (data.entities) {
        for (const entity of data.entities) {
          if (entity.roles && entity.roles.includes('registrar')) {
            registrar = entity.vcardArray?.[1]?.find(v => v[0] === 'fn')?.[3]
              || entity.handle
              || 'Unknown';
            break;
          }
        }
      }

      // คำนวณอายุโดเมน
      const created = createdDate ? new Date(createdDate) : null;
      const domainAge = created
        ? Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24))
        : null;

      return {
        domain: domain,
        registrar: registrar,
        createdDate: createdDate || null,
        expiresDate: expiresDate || null,
        updatedDate: updatedDate || null,
        domainAge: domainAge,
        nameServers: data.nameservers?.map(ns => ns.ldhName) || [],
        status: data.status?.join(', ') || 'Unknown'
      };

    } catch (error) {
      console.error('WHOIS/RDAP lookup error:', error.message);
      // ลอง fallback ด้วย whois.iana.org
      return this.fallbackLookup(domain);
    }
  }

  // Fallback: ใช้ ip-api สำหรับข้อมูลเบื้องต้น
  async fallbackLookup(domain) {
    try {
      const response = await axios.get(
        `https://api.domainsdb.info/v1/domains/search?domain=${domain}&zone=com`,
        { timeout: 5000 }
      );
      const data = response.data?.domains?.[0];
      if (data) {
        const created = data.create_date ? new Date(data.create_date) : null;
        const domainAge = created
          ? Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24))
          : null;
        return {
          domain: domain,
          registrar: 'Unknown',
          createdDate: data.create_date || null,
          expiresDate: null,
          updatedDate: data.update_date || null,
          domainAge: domainAge,
          nameServers: [],
          status: 'Unknown'
        };
      }
    } catch (e) {
      // ignore
    }
    return this.getDefaultData(domain);
  }

  // ข้อมูลเริ่มต้นเมื่อ lookup ไม่ได้
  getDefaultData(domain) {
    return {
      domain: domain,
      registrar: 'Unknown',
      createdDate: null,
      expiresDate: null,
      updatedDate: null,
      domainAge: null,
      nameServers: [],
      status: 'Unknown'
    };
  }

  // แปลงอายุเป็นข้อความ
  formatDomainAge(days) {
    if (!days) return 'Unknown';

    if (days < 30) {
      return `${days} วัน (⚠️ ใหม่มาก!)`;
    } else if (days < 365) {
      const months = Math.floor(days / 30);
      return `${months} เดือน`;
    } else {
      const years = Math.floor(days / 365);
      const remainingMonths = Math.floor((days % 365) / 30);
      return `${years} ปี${remainingMonths > 0 ? ` ${remainingMonths} เดือน` : ''}`;
    }
  }
}

module.exports = new WhoisService();
