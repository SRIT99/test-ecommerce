const express = require('express');
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  assignTransporter,
  addOrderReview,
  getOrderStats
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');
const {
  validateIdParam,
  validateOrder,
  validatePagination
} = require('../middleware/validation');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/', validatePagination, getOrders);
router.get('/stats/overview', getOrderStats);
router.post('/', validateOrder, createOrder);
router.get('/:id', validateIdParam, getOrder);
router.put('/:id/status', validateIdParam, updateOrderStatus);
router.put('/:id/assign-transporter', validateIdParam, assignTransporter);
router.put('/:id/review', validateIdParam, addOrderReview);

module.exports = router;