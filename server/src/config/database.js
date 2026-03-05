const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DB_PATH || path.join(__dirname, '../../database/scanner.db');
const dbDir = path.dirname(dbPath);

// Create database folder if not exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

class Database {
  constructor() {
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Database connection error:', err.message);
      } else {
        console.log('Connected to SQLite database');
        this._initTables();
      }
    });
  }

  // Initialize tables on startup
  _initTables() {
    this.db.serialize(() => {
      this.db.run(`
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
        )
      `, (err) => {
        if (err) console.error('Error creating scan_history table:', err.message);
        else console.log('Table scan_history ready');
      });

      this.db.run(`
        CREATE TABLE IF NOT EXISTS dangerous_urls (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          url TEXT UNIQUE NOT NULL,
          domain TEXT,
          first_detected DATETIME DEFAULT CURRENT_TIMESTAMP,
          scan_count INTEGER DEFAULT 1,
          avg_security_score REAL,
          max_security_score INTEGER,
          last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) console.error('Error creating dangerous_urls table:', err.message);
        else console.log('Table dangerous_urls ready');
      });

      // Indexes
      const indexes = [
        'CREATE INDEX IF NOT EXISTS idx_user_ip ON scan_history(user_ip)',
        'CREATE INDEX IF NOT EXISTS idx_scan_timestamp ON scan_history(scan_timestamp DESC)',
        'CREATE INDEX IF NOT EXISTS idx_is_dangerous ON scan_history(is_dangerous)',
        'CREATE INDEX IF NOT EXISTS idx_dangerous_url ON dangerous_urls(url)',
        'CREATE INDEX IF NOT EXISTS idx_scan_count ON dangerous_urls(scan_count DESC)'
      ];
      indexes.forEach(sql => this.db.run(sql));
    });
  }

  // Run query
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  // Get single row
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Get all rows
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Close connection
  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

module.exports = new Database();
