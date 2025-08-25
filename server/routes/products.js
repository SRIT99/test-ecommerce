const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByFarmer,
  getProductStats
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const {
  validateIdParam,
  validateProduct,
  validateProductFilters,
  validatePagination
} = require('../middleware/validation');
const { uploadProductImages, handleUploadErrors } = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', validateProductFilters, validatePagination, getProducts);
router.get('/:id', validateIdParam, getProduct);
router.get('/farmer/:farmerId', validateIdParam, getProductsByFarmer);

// Protected routes
router.use(protect);

router.post('/', authorize('farmer', 'admin'), validateProduct, createProduct);
router.put('/:id', authorize('farmer', 'admin'), validateIdParam, validateProduct, updateProduct);
router.delete('/:id', authorize('farmer', 'admin'), validateIdParam, deleteProduct);

// Image upload route
router.post(
  '/:id/images',
  authorize('farmer', 'admin'),
  validateIdParam,
  uploadProductImages,
  handleUploadErrors,
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      
      // Check ownership
      if (product.farmer.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this product'
        });
      }
      
      // Add new images to product
      if (req.files && req.files.length > 0) {
        const newImages = req.files.map(file => ({
          url: file.path,
          public_id: file.filename
        }));
        
        product.images = [...product.images, ...newImages];
        await product.save();
      }
      
      res.status(200).json({
        success: true,
        message: 'Images uploaded successfully',
        data: product.images
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

// Admin only routes
router.get('/stats/overview', authorize('admin'), getProductStats);

module.exports = router;