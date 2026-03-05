const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // VirusTotal errors
  if (message.includes('Rate limit')) {
    statusCode = 429;
  } else if (message.includes('Invalid VirusTotal API')) {
    statusCode = 401;
  }

  // Validation errors
  if (message.includes('Invalid URL')) {
    statusCode = 400;
  }

  // Database errors
  if (err.code === 'SQLITE_ERROR') {
    statusCode = 500;
    message = 'Database error occurred';
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message: message,
      statusCode: statusCode,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

module.exports = errorHandler;
