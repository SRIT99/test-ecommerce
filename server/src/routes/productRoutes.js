const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { allow } = require('../middleware/roles');
const productController = require('../controllers/productController');
const uploadController = require('../controllers/uploadController');

// Public routes
router.get('/', productController.searchProducts); // Search & filter products
router.get('/:id', productController.getProductById); // Get single product

// Protected routes - only sellers and admins can create/update
router.post('/', protect, allow('seller', 'admin'), productController.create);
router.put('/:id', protect, allow('seller', 'admin'), productController.update);

router.post('/upload/image', protect, allow('seller', 'admin'), 
  uploadController.uploadProductImage, 
  uploadController.handleImageUpload
);
module.exports = router;