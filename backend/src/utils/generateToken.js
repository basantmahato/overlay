const jwt = require('jsonwebtoken');

const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '15m', // Access token expires in 15 minutes
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || 'refresh_secret_123', {
    expiresIn: '7d', // Refresh token expires in 7 days
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
