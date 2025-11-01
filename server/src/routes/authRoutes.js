// routes/authRoutes.js
const express = require('express');
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  validateResetToken
} = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/validate-reset-token', validateResetToken);

module.exports = router;
