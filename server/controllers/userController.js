const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Transaction = require('../models/Transaction');
const geospatial = require('../utils/geospatial');
const APIFeatures = require('../utils/apifeatures');
const { cloudinaryUtils } = require('../config/cloudinary');

// @desc    Get all users (Admin only)
// @route   GET /api/v1/users
// @access  Private (Admin only)
exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    
    // Build query
    let query = {};
    
    if (role) {
      query.role = role;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Execute query with pagination
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await User.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: users.length,
      total,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Private
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('products', 'name price category images')
      .populate('orders', 'orderId totalAmount orderStatus');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if user is accessing their own profile or is admin
    if (req.user.id !== user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this user'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/v1/users/profile/me
// @access  Private
exports.getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate({
        path: 'products',
        select: 'name price category images isAvailable quantity',
        options: { sort: { createdAt: -1 }, limit: 5 }
      })
      .populate({
        path: 'orders',
        select: 'orderId totalAmount orderStatus createdAt',
        options: { sort: { createdAt: -1 }, limit: 5 }
      });
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/v1/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address, city, lat, lng } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    
    // Update location if provided
    if (address || city || lat || lng) {
      updateData.location = {
        address: address || req.user.location.address,
        city: city || req.user.location.city,
        coordinates: {
          lat: lat ? parseFloat(lat) : req.user.location.coordinates.lat,
          lng: lng ? parseFloat(lng) : req.user.location.coordinates.lng
        }
      };
    }
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete user account
// @route   DELETE /api/v1/users/profile
// @access  Private
exports.deleteAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Check if user has active products or orders
    const activeProducts = await Product.countDocuments({
      farmer: req.user.id,
      isAvailable: true
    });
    
    const activeOrders = await Order.countDocuments({
      $or: [{ buyer: req.user.id }, { farmer: req.user.id }],
      orderStatus: { $in: ['pending', 'confirmed', 'processing', 'shipped'] }
    });
    
    if (activeProducts > 0 || activeOrders > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete account with active products or orders'
      });
    }
    
    await User.findByIdAndDelete(req.user.id);
    
    // Also delete user's products and orders (soft delete or archive in real scenario)
    
    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user dashboard statistics
// @route   GET /api/v1/users/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res, next) => {
  try {
    let stats = {};
    
    if (req.user.role === 'farmer') {
      // Farmer statistics
      const productStats = await Product.aggregate([
        { $match: { farmer: req.user._id } },
        {
          $group: {
            _id: null,
            totalProducts: { $sum: 1 },
            availableProducts: {
              $sum: { $cond: [{ $eq: ['$isAvailable', true] }, 1, 0] }
            },
            totalQuantity: { $sum: '$quantity' },
            averageRating: { $avg: '$rating.average' }
          }
        }
      ]);
      
      const orderStats = await Order.aggregate([
        { $match: { farmer: req.user._id } },
        {
          $group: {
            _id: '$orderStatus',
            count: { $sum: 1 },
            totalAmount: { $sum: '$totalAmount' }
          }
        }
      ]);
      
      const transactionStats = await Transaction.aggregate([
        { $match: { user: req.user._id, status: 'completed' } },
        {
          $group: {
            _id: null,
            totalEarnings: { $sum: '$amount' },
            transactionCount: { $sum: 1 }
          }
        }
      ]);
      
      stats = {
        products: productStats[0] || {
          totalProducts: 0,
          availableProducts: 0,
          totalQuantity: 0,
          averageRating: 0
        },
        orders: orderStats,
        transactions: transactionStats[0] || {
          totalEarnings: 0,
          transactionCount: 0
        }
      };
    } else if (req.user.role === 'buyer') {
      // Buyer statistics
      const orderStats = await Order.aggregate([
        { $match: { buyer: req.user._id } },
        {
          $group: {
            _id: '$orderStatus',
            count: { $sum: 1 },
            totalSpent: { $sum: '$totalAmount' }
          }
        }
      ]);
      
      stats = {
        orders: orderStats
      };
    } else if (req.user.role === 'transporter') {
      // Transporter statistics
      const deliveryStats = await Order.aggregate([
        { $match: { transporter: req.user._id } },
        {
          $group: {
            _id: '$orderStatus',
            count: { $sum: 1 },
            totalEarnings: { $sum: '$deliveryFee' }
          }
        }
      ]);
      
      stats = {
        deliveries: deliveryStats
      };
    }
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get nearby farmers
// @route   GET /api/v1/users/farmers/nearby
// @access  Public
exports.getNearbyFarmers = async (req, res, next) => {
  try {
    const { lat, lng, distance = 50, page = 1, limit = 10 } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }
    
    const coordinates = [parseFloat(lng), parseFloat(lat)];
    const maxDistance = parseInt(distance) * 1000; // Convert to meters
    
    const farmers = await User.find({
      role: 'farmer',
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: coordinates
          },
          $maxDistance: maxDistance
        }
      }
    })
    .select('name avatar location rating products')
    .populate({
      path: 'products',
      match: { isAvailable: true },
      select: 'name price category images',
      options: { limit: 3 }
    })
    .limit(limit * 1)
    .skip((page - 1) * limit);
    
    const total = await User.countDocuments({
      role: 'farmer',
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: coordinates
          },
          $maxDistance: maxDistance
        }
      }
    });
    
    res.status(200).json({
      success: true,
      count: farmers.length,
      total,
      data: farmers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user role (Admin only)
// @route   PUT /api/v1/users/:id/role
// @access  Private (Admin only)
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    
    if (!['farmer', 'buyer', 'transporter', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified'
      });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      {
        new: true,
        runValidators: true
      }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Verify user (Admin only)
// @route   PUT /api/v1/users/:id/verify
// @access  Private (Admin only)
exports.verifyUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      {
        new: true,
        runValidators: true
      }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'User verified successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user activity log
// @route   GET /api/v1/users/:id/activity
// @access  Private (Admin or self)
exports.getUserActivity = async (req, res, next) => {
  try {
    // Check authorization
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this user activity'
      });
    }
    
    const { page = 1, limit = 20 } = req.query;
    
    // Get user's recent orders, products, and transactions
    const [orders, products, transactions] = await Promise.all([
      Order.find({ 
        $or: [{ buyer: req.params.id }, { farmer: req.params.id }] 
      })
      .select('orderId totalAmount orderStatus createdAt')
      .sort({ createdAt: -1 })
      .limit(5),
      
      Product.find({ farmer: req.params.id })
      .select('name price category createdAt')
      .sort({ createdAt: -1 })
      .limit(5),
      
      Transaction.find({ user: req.params.id })
      .select('amount status paymentMethod createdAt')
      .sort({ createdAt: -1 })
      .limit(5)
    ]);
    
    const activity = [
      ...orders.map(order => ({
        type: 'order',
        action: order.orderStatus,
        details: `Order ${order.orderId}`,
        amount: order.totalAmount,
        timestamp: order.createdAt
      })),
      ...products.map(product => ({
        type: 'product',
        action: 'created',
        details: product.name,
        amount: product.price,
        timestamp: product.createdAt
      })),
      ...transactions.map(transaction => ({
        type: 'transaction',
        action: transaction.status,
        details: `Payment via ${transaction.paymentMethod}`,
        amount: transaction.amount,
        timestamp: transaction.createdAt
      }))
    ].sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
    
    res.status(200).json({
      success: true,
      count: activity.length,
      data: activity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }

  // @desc    Upload user avatar
// @route   POST /api/v1/users/profile/avatar
// @access  Private
exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }
    
    const user = await User.findById(req.user.id);
    
    // Delete old avatar if exists
    if (user.avatar && user.avatar !== 'default-avatar.jpg') {
      try {
        await cloudinaryUtils.deleteImage(user.avatarPublicId);
      } catch (error) {
        console.warn('Failed to delete old avatar:', error.message);
      }
    }
    
    // Update user with new avatar
    user.avatar = req.file.path;
    user.avatarPublicId = req.file.filename;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        avatar: user.avatar,
        avatarPublicId: user.avatarPublicId
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
};