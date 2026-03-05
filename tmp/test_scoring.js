const virusTotalService = require('../server/src/services/virustotal');

// Mock data
const mockAttributesSafe = {
    stats: { malicious: 0, suspicious: 0, undetected: 60, harmless: 10 },
    results: {
        'Google Safe Browsing': { category: 'harmless' },
        'Microsoft Defender SmartScreen': { category: 'harmless' },
        'TotalDefense': { category: 'harmless' }
    }
};

const mockAttributesHighlyDangerous = {
    stats: { malicious: 2, suspicious: 0, undetected: 68, harmless: 0 },
    results: {
        'Google Safe Browsing': { category: 'malicious' },
        'Microsoft Defender SmartScreen': { category: 'malicious' },
        'Other': { category: 'harmless' }
    }
};

const mockAttributesMildlySuspicious = {
    stats: { malicious: 1, suspicious: 1, undetected: 68, harmless: 0 },
    results: {
        'Google Safe Browsing': { category: 'harmless' },
        'NonTrustedEngine': { category: 'malicious' },
        'AnotherNonTrusted': { category: 'suspicious' }
    }
};

function test() {
    console.log('--- Testing Weighted Scoring ---');

    const safeResult = virusTotalService.parseResults(mockAttributesSafe, 'http://safe.com');
    console.log('Safe URL Score:', safeResult.securityScore, 'Level:', safeResult.threatLevel);

    const dangerousResult = virusTotalService.parseResults(mockAttributesHighlyDangerous, 'http://malware.com');
    console.log('Dangerous URL (Trusted Engines) Score:', dangerousResult.securityScore, 'Level:', dangerousResult.threatLevel);
    // Expected: Trusted engines weight 2.5 each. total weight = 2.5 + 2.5 + 1.0 = 6.0
    // Malicious sum = (1.0 * 2.5) + (1.0 * 2.5) = 5.0
    // Ratio = 5/6 * 100 = 83.33% -> should be very_dangerous (score 100)

    const suspiciousResult = virusTotalService.parseResults(mockAttributesMildlySuspicious, 'http://suspicious.com');
    console.log('Suspicious URLScore:', suspiciousResult.securityScore, 'Level:', suspiciousResult.threatLevel);
    // Expected: Google is harmless. 
    // Trusted weight: 2.5 (Google)
    // NonTrusted: 1.0 (Malicious)
    // AnotherNonTrusted: 1.0 (Suspicious)
    // Total weight: 2.5 + 1.0 + 1.0 = 4.5
    // Weighted sum: (0*2.5) + (1.0*1.0) + (0.4*1.0) = 1.4
    // Ratio: 1.4 / 4.5 * 100 = 31.11% -> should be very_dangerous (score 100) based on my logic? 
    // Wait, my threshold for very_dangerous is ratio >= 20.
}

test();
