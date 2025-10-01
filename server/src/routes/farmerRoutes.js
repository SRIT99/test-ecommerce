const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { allow } = require('../middleware/roles');
const farmerController = require('../controllers/farmerController');

// Farmer dashboard routes
router.get('/stats', protect, allow('seller'), farmerController.getFarmerStats);
router.get('/products', protect, allow('seller'), farmerController.getFarmerProducts);
router.get('/orders', protect, allow('seller'), farmerController.getFarmerOrders);
router.put('/profile', protect, allow('seller'), farmerController.updateFarmerProfile);

module.exports = router;