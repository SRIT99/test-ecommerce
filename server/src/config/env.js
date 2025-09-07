require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  baseUrl: process.env.BASE_URL || 'http://localhost:5000',
  esewa: {
    env: process.env.ESEWA_ENV || 'RC',
    merchant: process.env.ESEWA_MERCHANT_CODE
  },
  khalti: {
    secret: process.env.KHALTI_SECRET_KEY
  }
};
