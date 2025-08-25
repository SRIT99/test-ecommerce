const Product = require('../models/Product');
const User = require('../models/User');
const APIFeatures = require('../utils/apifeatures');
const geospatial = require('../utils/geospatial');
const pricing = require('../utils/pricing');
const { cloudinaryUtils } = require('../config/cloudinary');

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    // Execute query
    const features = new APIFeatures(Product.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    
    // Add text search if provided
    if (req.query.search) {
      features.query = features.query.find({
        $text: { $search: req.query.search }
      });
    }
    
    // Add geospatial search if coordinates provided
    if (req.query.lat && req.query.lng) {
      const maxDistance = req.query.distance || 50; // default 50km
      features.query = features.query.find({
        'location.coordinates': {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)]
            },
            $maxDistance: maxDistance * 1000 // convert to meters
          }
        }
      });
    }
    
    const products = await features.query.populate('farmer', 'name avatar rating');
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('farmer', 'name avatar rating location');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Increment view count
    product.views += 1;
    await product.save();
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new product
// @route   POST /api/v1/products
// @access  Private (Farmers only)
exports.createProduct = async (req, res, next) => {
  try {
    // Add farmer to req.body
    req.body.farmer = req.user.id;
    
    // Get farmer location
    const farmer = await User.findById(req.user.id);
    req.body.location = farmer.location;
    
    // Get suggested price if not provided
    if (!req.body.price) {
      const suggestedPrice = await pricing.getSuggestedPrice(
        req.body.name, 
        req.body.category
      );
      req.body.price = suggestedPrice;
    }
    
    const product = await Product.create(req.body);
    
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private (Product owner only)
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    
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
    
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private (Product owner or admin)
exports.deleteProduct = async (req, res, next) => {
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
        message: 'Not authorized to delete this product'
      });
    }
    
    await product.remove();
    
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get products by farmer
// @route   GET /api/v1/products/farmer/:farmerId
// @access  Public
exports.getProductsByFarmer = async (req, res, next) => {
  try {
    const products = await Product.find({ farmer: req.params.farmerId })
      .populate('farmer', 'name avatar rating');
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get product statistics
// @route   GET /api/v1/products/stats/overview
// @access  Private (Admin only)
exports.getProductStats = async (req, res, next) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          avgRating: { $avg: '$rating.average' },
          totalQuantity: { $sum: '$quantity' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    const totalProducts = await Product.countDocuments();
    const totalAvailable = await Product.countDocuments({ isAvailable: true });
    const totalFarmers = await Product.distinct('farmer').length;
    
    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalAvailable,
        totalFarmers,
        byCategory: stats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }

  // @desc    Upload product images
// @route   POST /api/v1/products/:id/images
// @access  Private (Farmers only)
exports.uploadProductImages = async (req, res, next) => {
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
    
    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one image'
      });
    }
    
    // Process uploaded images
    const newImages = [];
    
    for (const file of req.files) {
      const imageData = {
        url: file.path,
        public_id: file.filename
      };
      newImages.push(imageData);
    }
    
    // Add new images to product
    product.images = [...product.images, ...newImages];
    await product.save();
    
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
};

// @desc    Delete product image
// @route   DELETE /api/v1/products/:id/images/:imageId
// @access  Private (Farmers only)
exports.deleteProductImage = async (req, res, next) => {
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
    
    // Find the image to delete
    const imageIndex = product.images.findIndex(
      img => img.public_id === req.params.imageId
    );
    
    if (imageIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }
    
    const imageToDelete = product.images[imageIndex];
    
    // Delete from Cloudinary
    await cloudinaryUtils.deleteImage(imageToDelete.public_id);
    
    // Remove from product images array
    product.images.splice(imageIndex, 1);
    await product.save();
    
    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
      data: product.images
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
};