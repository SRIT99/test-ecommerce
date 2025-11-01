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
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
   email: {
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: process.env.MAIL_PORT || 587,
    user: process.env.MAIL_USER || 'surajworkspace12@gmail.com',
    pass: process.env.MAIL_PASS || 'uhgb fzij egai kyas',
    from: process.env.MAIL_FROM || '"DOKO" <noreply@doko.com>'
  }
};
