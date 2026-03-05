require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const corsMiddleware = require('./config/cors');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Security headers
app.use(morgan('combined')); // Logging
app.use(corsMiddleware); // CORS
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded
app.use(generalLimiter); // Rate limiting

// API Routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Link Security Scanner API',
    version: '1.0.0',
    endpoints: {
      scan: 'POST /api/scan',
      history: 'GET /api/history',
      threats: 'GET /api/threats/top10',
      health: 'GET /api/health'
    }
  });
});

// Error handling (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, async () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║       🔒 Link Security Scanner API                    ║
║                                                       ║
║       Server running on port ${PORT}                     ║
║       Environment: ${process.env.NODE_ENV || 'development'}                   ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);

  // Initialize database
  try {
    const db = require('./config/database');
    console.log('✅ Database connected');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }

  // Test VirusTotal API
  const virusTotalService = require('./services/virustotal');
  const hasValidKey = await virusTotalService.testAPIKey();
  
  if (hasValidKey) {
    console.log('✅ VirusTotal API key is valid');
  } else {
    console.warn('⚠️  VirusTotal API key is missing or invalid');
  }

  console.log('\n📡 API endpoints ready:');
  console.log(`   POST   http://localhost:${PORT}/api/scan`);
  console.log(`   GET    http://localhost:${PORT}/api/history`);
  console.log(`   GET    http://localhost:${PORT}/api/threats/top10`);
  console.log(`   GET    http://localhost:${PORT}/api/health\n`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\n🛑 Shutting down gracefully...');
  
  const db = require('./config/database');
  await db.close();
  
  console.log('✅ Database connection closed');
  console.log('👋 Goodbye!\n');
  process.exit(0);
});

module.exports = app;
