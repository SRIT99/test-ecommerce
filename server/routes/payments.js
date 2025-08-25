const express = require('express');
const {
  initiatePayment,
  verifyPayment,
  getTransactions,
  getTransaction,
  refundPayment
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');
const {
  validateIdParam,
  validatePayment,
  validatePagination,
  validateRefund
} = require('../middleware/validation');

const router = express.Router();

// Public route (called by payment gateways)
router.post('/verify', verifyPayment);

// Protected routes
router.use(protect);

router.post('/initiate', validatePayment, initiatePayment);
router.get('/transactions', validatePagination, getTransactions);
router.get('/transactions/:id', validateIdParam, getTransaction);
router.post('/transactions/:id/refund', authorize('admin'), validateIdParam, validateRefund, refundPayment);

module.exports = router;