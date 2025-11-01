const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { allow } = require('../middleware/roles');
const ctrl = require('../controllers/orderController');

// ==================== BUYER ROUTES ====================
router.post('/', protect, ctrl.createOrder);
router.get('/mine', protect, ctrl.myOrders);
router.get('/:id', protect, ctrl.getOrderById); 
router.patch('/:id/status', protect, ctrl.updateOrderStatus);

// ==================== FARMER/SELLER ROUTES ====================
router.get('/orders', protect, allow('seller', 'admin'), ctrl.getFarmerOrders);
router.get('/analytics', protect, allow('seller', 'admin'), ctrl.getFarmerAnalytics);

// ==================== ADMIN ROUTES ====================
router.get('/admin/orders', protect, allow('admin', 'superadmin'), ctrl.getAllOrders);
router.get('/admin/analytics', protect, allow('admin', 'superadmin'), ctrl.getAdminAnalytics);
router.get('/admin/orders/:id', protect, allow('admin', 'superadmin'), ctrl.getOrderById);

module.exports = router;