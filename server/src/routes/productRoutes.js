const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { allow } = require('../middleware/roles');
const productController = require('../controllers/productController');

// Public routes
router.get('/', productController.listProduct);
router.get('/:id', productController.getProduct);

// Protected routes - only sellers and admins can create/update
router.post('/', protect, allow('seller', 'admin'), productController.create);
router.put('/:id', protect, allow('seller', 'admin'), productController.update);

module.exports = router;