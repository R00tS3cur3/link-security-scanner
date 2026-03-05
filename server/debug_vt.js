
const VirusTotalService = require('./src/services/virustotal');

function runTest() {
    console.log('--- Testing VirusTotal parseResults ---');

    // Case 1: Safe URL (No malicious engines)
    const mockSafe = {
        stats: { malicious: 0, suspicious: 0, undetected: 70, harmless: 5 },
        results: {
            'Engine A': { category: 'undetected' },
            'Engine B': { category: 'harmless' }
        }
    };
    const resSafe = VirusTotalService.parseResults(mockSafe, 'http://safe.com');
    console.log('Safe URL Test:', resSafe.threatLevel === 'safe' ? 'PASS' : 'FAIL', `(Score: ${resSafe.securityScore}, Level: ${resSafe.threatLevel})`);

    // Case 2: Suspicious (1 small engine)
    const mockSuspicious = {
        stats: { malicious: 1, suspicious: 0, undetected: 69, harmless: 0 },
        results: {
            'Small Engine': { category: 'malicious' },
            'Another Engine': { category: 'undetected' }
        }
    };
    const resSuspicious = VirusTotalService.parseResults(mockSuspicious, 'http://suspicious.com');
    // ratio = (1/2)*100 = 50% ? Wait, loop over results
    // Let's check calculation:
    // Small Engine weight 1.0, malicious -> score 1.0
    // Another Engine weight 1.0 -> totalWeight 2.0
    // Ratio = 1/2 * 100 = 50%? 
    // Wait, if Ratio = 50%, it should be 'very_dangerous' (Threshold > 20)
    // Actually, in VirusTotal, 'results' contains many engines.
    console.log('Suspicious Test (1/2 engines):', resSuspicious.threatLevel, `(Score: ${resSuspicious.securityScore})`);

    // Case 3: Trusted Engine Detection
    const mockTrusted = {
        stats: { malicious: 1, suspicious: 0, undetected: 9, harmless: 0 },
        results: {
            'Google Safe Browsing': { category: 'malicious' },
            ...Array(9).fill(0).reduce((acc, _, i) => ({ ...acc, [`Engine ${i}`]: { category: 'undetected' } }), {})
        }
    };
    const resTrusted = VirusTotalService.parseResults(mockTrusted, 'http://trusted-detect.com');
    // Google: weight 2.5, score 2.5
    // 9 others: weight 1.0 each, total 9.0
    // TotalWeight = 11.5
    // Ratio = 2.5 / 11.5 * 100 = 21.7%
    // Ratio > 20 -> very_dangerous
    console.log('Trusted Engine Test:', resTrusted.threatLevel === 'very_dangerous' ? 'PASS' : 'FAIL', `(Ratio: ~21.7%, Level: ${resTrusted.threatLevel})`);

    // Case 4: Non-Trusted Engine (Lower weight)
    const mockUntrusted = {
        stats: { malicious: 1, suspicious: 0, undetected: 9, harmless: 0 },
        results: {
            'Random Engine': { category: 'malicious' },
            ...Array(9).fill(0).reduce((acc, _, i) => ({ ...acc, [`Engine ${i}`]: { category: 'undetected' } }), {})
        }
    };
    const resUntrusted = VirusTotalService.parseResults(mockUntrusted, 'http://untrusted-detect.com');
    // Random: weight 1.0, score 1.0
    // 9 others: weight 1.0 each, total 9.0
    // TotalWeight = 10.0
    // Ratio = 1.0 / 10.0 * 100 = 10%
    // 8 < Ratio < 20 -> dangerous
    console.log('Untrusted Engine Test:', resUntrusted.threatLevel === 'dangerous' ? 'PASS' : 'FAIL', `(Ratio: 10%, Level: ${resUntrusted.threatLevel})`);

    console.log('\n--- Stats Integrity Check ---');
    console.log('Stats:', JSON.stringify(resUntrusted.stats));
    if (resUntrusted.stats.total === 10) {
        console.log('Stats Total Check: PASS');
    } else {
        console.log('Stats Total Check: FAIL', `Expected 10, got ${resUntrusted.stats.total}`);
    }
}

runTest();
