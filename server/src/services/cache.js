const NodeCache = require('node-cache');

// Cache TTL: 24 ชั่วโมง (86400 วินาที)
const cacheTTL = parseInt(process.env.CACHE_TTL) || 86400;

class CacheService {
  constructor() {
    this.cache = new NodeCache({ 
      stdTTL: cacheTTL,
      checkperiod: 600 // ตรวจสอบทุก 10 นาที
    });
  }

  get(key) {
    return this.cache.get(key);
  }

  set(key, value, ttl = cacheTTL) {
    return this.cache.set(key, value, ttl);
  }

  del(key) {
    return this.cache.del(key);
  }

  flush() {
    return this.cache.flushAll();
  }

  getStats() {
    return this.cache.getStats();
  }

  // สร้าง cache key จาก URL
  generateKey(url) {
    return `scan:${url}`;
  }
}

module.exports = new CacheService();
