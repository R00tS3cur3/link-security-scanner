
const VirusTotalService = require('./server/src/services/virustotal');

// Mock attributes from VirusTotal
const mockAttributes = {
    stats: {
        malicious: 2,
        suspicious: 1,
        undetected: 60,
        harmless: 10,
        timeout: 0
    },
    results: {
        'Google Safe Browsing': { category: 'malicious', result: 'phishing' },
        'Kaspersky': { category: 'suspicious', result: 'suspicious' },
        'Unknown Engine': { category: 'malicious', result: 'malware' }
    }
};

try {
    const result = VirusTotalService.parseResults(mockAttributes, 'http://example.com');
    console.log('Test Result:', JSON.stringify(result, null, 2));
} catch (error) {
    console.error('Test Failed:', error);
}
