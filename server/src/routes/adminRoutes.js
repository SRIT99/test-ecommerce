// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { allow } = require('../middleware/roles');
const adminController = require('../controllers/adminController');

// Dashboard & Analytics
router.get('/stats', protect, allow('admin', 'superadmin'), adminController.getStats);
router.get('/analytics', protect, allow('admin', 'superadmin'), adminController.getAnalytics);
router.get('/activities', protect, allow('admin', 'superadmin'), adminController.getRecentActivities);
router.get('/system-status', protect, allow('admin', 'superadmin'), adminController.getSystemStatus);

// User Management
router.get('/users', protect, allow('admin', 'superadmin'), adminController.getUsers);
router.patch('/users/:id/verify', protect, allow('admin', 'superadmin'), adminController.verifyUser);
router.patch('/users/:id/suspend', protect, allow('admin', 'superadmin'), adminController.suspendUser);
router.delete('/users/:id', protect, allow('admin', 'superadmin'), adminController.deleteUser);

// Product Management
router.get('/products', protect, allow('admin', 'superadmin'), adminController.getProducts);
router.delete('/products/:id', protect, allow('admin', 'superadmin'), adminController.deleteProduct);

// Order Management
router.get('/orders', protect, allow('admin', 'superadmin'), adminController.getOrders);
router.get('/orders/analytics', protect, allow('admin', 'superadmin'), adminController.getOrderAnalytics);

// Price Management
router.post('/sync-prices', protect, allow('admin', 'superadmin'), adminController.syncPrices);
router.get('/price-history', protect, allow('admin', 'superadmin'), adminController.getPriceHistory);

// Reports
router.get('/reports/:type', protect, allow('admin', 'superadmin'), adminController.generateReport);

// Notifications
router.post('/broadcast', protect, allow('admin', 'superadmin'), adminController.sendBroadcast);

module.exports = router;