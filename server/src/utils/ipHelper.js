class IPHelper {
  // ดึง IP ของผู้ใช้
  getUserIP(req) {
    // ตรวจสอบจาก headers ต่างๆ
    const forwarded = req.headers['x-forwarded-for'];
    const real = req.headers['x-real-ip'];
    const cloudflare = req.headers['cf-connecting-ip'];
    
    if (forwarded) {
      // x-forwarded-for อาจมีหลาย IP (client, proxy1, proxy2)
      return forwarded.split(',')[0].trim();
    }
    
    if (cloudflare) {
      return cloudflare;
    }
    
    if (real) {
      return real;
    }
    
    // Fallback: ใช้ connection address
    return req.connection.remoteAddress 
      || req.socket.remoteAddress 
      || req.connection.socket.remoteAddress
      || '0.0.0.0';
  }

  // ตรวจสอบว่าเป็น IPv4 หรือ IPv6
  getIPVersion(ip) {
    if (ip.includes(':')) {
      return 'IPv6';
    } else if (ip.includes('.')) {
      return 'IPv4';
    }
    return 'Unknown';
  }

  // แปลง IPv6 ให้เป็น IPv4 (ถ้าเป็น IPv4-mapped)
  normalizeIP(ip) {
    // ::ffff:192.168.1.1 → 192.168.1.1
    if (ip.startsWith('::ffff:')) {
      return ip.substring(7);
    }
    
    // ::1 → localhost
    if (ip === '::1') {
      return '127.0.0.1';
    }
    
    return ip;
  }

  // ตรวจสอบว่าเป็น IP ส่วนตัว (private IP)
  isPrivateIP(ip) {
    const normalizedIP = this.normalizeIP(ip);
    
    // Private IPv4 ranges
    const privateRanges = [
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^192\.168\./,
      /^127\./,
      /^169\.254\./,
      /^0\.0\.0\.0$/
    ];
    
    return privateRanges.some(range => range.test(normalizedIP));
  }
}

module.exports = new IPHelper();
