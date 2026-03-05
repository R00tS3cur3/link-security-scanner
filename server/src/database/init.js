const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../../../database/scanner.db');
const dbDir = path.dirname(dbPath);

// Create database folder if not exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('Connected to SQLite database');
});

// Create scan_history table
const createScanHistoryTable = `
  CREATE TABLE IF NOT EXISTS scan_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_ip TEXT NOT NULL,
    original_input TEXT,
    scanned_url TEXT NOT NULL,
    was_shortened BOOLEAN DEFAULT 0,
    final_url TEXT,
    security_score INTEGER,
    is_dangerous BOOLEAN DEFAULT 0,
    threat_details TEXT,
    country TEXT,
    ip_address TEXT,
    scan_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    virustotal_data TEXT,
    malicious_count INTEGER DEFAULT 0,
    suspicious_count INTEGER DEFAULT 0,
    total_engines INTEGER DEFAULT 0
  );
`;

// Create dangerous_urls table
const createDangerousUrlsTable = `
  CREATE TABLE IF NOT EXISTS dangerous_urls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT UNIQUE NOT NULL,
    domain TEXT,
    first_detected DATETIME DEFAULT CURRENT_TIMESTAMP,
    scan_count INTEGER DEFAULT 1,
    avg_security_score REAL,
    max_security_score INTEGER,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`;

// Create indexes
const createIndexes = `
  CREATE INDEX IF NOT EXISTS idx_user_ip ON scan_history(user_ip);
  CREATE INDEX IF NOT EXISTS idx_scan_timestamp ON scan_history(scan_timestamp DESC);
  CREATE INDEX IF NOT EXISTS idx_is_dangerous ON scan_history(is_dangerous);
  CREATE INDEX IF NOT EXISTS idx_dangerous_url ON dangerous_urls(url);
  CREATE INDEX IF NOT EXISTS idx_scan_count ON dangerous_urls(scan_count DESC);
`;

db.serialize(() => {
  db.run(createScanHistoryTable, (err) => {
    if (err) {
      console.error('Error creating scan_history table:', err.message);
    } else {
      console.log('Table scan_history created/verified');
    }
  });

  db.run(createDangerousUrlsTable, (err) => {
    if (err) {
      console.error('Error creating dangerous_urls table:', err.message);
    } else {
      console.log('Table dangerous_urls created/verified');
    }
  });

  createIndexes.split(';').forEach(indexSql => {
    if (indexSql.trim()) {
      db.run(indexSql, (err) => {
        if (err) {
          console.error('Error creating index:', err.message);
        }
      });
    }
  });

  console.log('All indexes created/verified');
});

// NOTE: Do NOT close db here - it is used by the server
module.exports = db;
