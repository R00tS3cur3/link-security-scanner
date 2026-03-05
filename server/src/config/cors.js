const cors = require('cors');

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:3000'];

const corsOptions = {
  origin: true, // Allow all origins by mirroring back the request origin
  credentials: true,
  optionsSuccessStatus: 200
};

module.exports = cors(corsOptions);
