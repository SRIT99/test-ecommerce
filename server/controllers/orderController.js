const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const geospatial = require('../utils/geospatial');
const APIFeatures = require('../utils/apifeatures');

// @desc    Get all orders
// @route   GET /api/v1/orders
// @access  Private
exports.getOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, role } = req.query;
    
    // Build query based on user role
    let query = {};
    
    if (req.user.role === 'farmer') {
      query.farmer = req.user.id;
    } else if (req.user.role === 'buyer') {
      query.buyer = req.user.id;
    } else if (req.user.role === 'transporter') {
      query.transporter = req.user.id;
    }
    // Admin can see all orders
    
    if (status) {
      query.orderStatus = status;
    }
    
    // Execute query with pagination
    const orders = await Order.find(query)
      .populate('buyer', 'name email phone')
      .populate('farmer', 'name email phone location')
      .populate('transporter', 'name phone')
      .populate('products.product', 'name price unit images')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Order.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single order
// @route   GET /api/v1/orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'name email phone location')
      .populate('farmer', 'name email phone location')
      .populate('transporter', 'name phone location')
      .populate('products.product', 'name price unit images category');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check authorization
    const isAuthorized = 
      order.buyer._id.toString() === req.user.id ||
      order.farmer._id.toString() === req.user.id ||
      (order.transporter && order.transporter._id.toString() === req.user.id) ||
      req.user.role === 'admin';
    
    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { products, shippingAddress, paymentMethod, notes } = req.body;
    
    // Validate products and calculate total amount
    let totalAmount = 0;
    const orderProducts = [];
    
    for (const item of products) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`
        });
      }
      
      if (!product.isAvailable || product.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product: ${product.name}`
        });
      }
      
      if (product.farmer.toString() !== item.farmerId) {
        return res.status(400).json({
          success: false,
          message: `Product ${product.name} does not belong to the specified farmer`
        });
      }
      
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;
      
      orderProducts.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });
      
      // Update product quantity
      product.quantity -= item.quantity;
      if (product.quantity === 0) {
        product.isAvailable = false;
      }
      await product.save();
    }
    
    // Get farmer ID from the first product
    const firstProduct = await Product.findById(products[0].product);
    const farmerId = firstProduct.farmer;
    
    // Calculate delivery fee based on distance
    const farmer = await User.findById(farmerId);
    const deliveryFee = await geospatial.calculateDeliveryFee(
      farmer.location.coordinates,
      {
        lat: parseFloat(shippingAddress.lat),
        lng: parseFloat(shippingAddress.lng)
      }
    );
    
    totalAmount += deliveryFee;
    
    // Create order
    const order = await Order.create({
      buyer: req.user.id,
      farmer: farmerId,
      products: orderProducts,
      totalAmount,
      shippingAddress,
      paymentMethod,
      deliveryFee,
      notes,
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
    });
    
    // Populate order with details
    const populatedOrder = await Order.findById(order._id)
      .populate('buyer', 'name email phone')
      .populate('farmer', 'name email phone')
      .populate('products.product', 'name price unit images');
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: populatedOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update order status
// @route   PUT /api/v1/orders/:id/status
// @access  Private
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status'
      });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check authorization based on user role
    let isAuthorized = false;
    
    if (status === 'cancelled') {
      // Only buyer can cancel order before confirmation
      if (order.orderStatus === 'pending' && order.buyer.toString() === req.user.id) {
        isAuthorized = true;
      }
      // Farmer can cancel before shipping
      else if (['pending', 'confirmed'].includes(order.orderStatus) && 
               order.farmer.toString() === req.user.id) {
        isAuthorized = true;
      }
      // Admin can always cancel
      else if (req.user.role === 'admin') {
        isAuthorized = true;
      }
    } else {
      // Farmer can update to confirmed/processing
      if (['confirmed', 'processing'].includes(status) && 
          order.farmer.toString() === req.user.id) {
        isAuthorized = true;
      }
      // Transporter can update to shipped/delivered
      else if (['shipped', 'delivered'].includes(status) && 
               order.transporter && 
               order.transporter.toString() === req.user.id) {
        isAuthorized = true;
      }
      // Admin can update any status
      else if (req.user.role === 'admin') {
        isAuthorized = true;
      }
    }
    
    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update order status'
      });
    }
    
    // Handle cancellation - restore product quantities
    if (status === 'cancelled' && order.orderStatus !== 'cancelled') {
      for (const item of order.products) {
        const product = await Product.findById(item.product);
        if (product) {
          product.quantity += item.quantity;
          product.isAvailable = true;
          await product.save();
        }
      }
      
      // Refund payment if already made
      if (order.paymentStatus === 'completed') {
        const transaction = await Transaction.findOne({ order: order._id });
        if (transaction) {
          await transaction.processRefund(
            order.totalAmount,
            'Order cancelled',
            req.user.id
          );
          order.paymentStatus = 'refunded';
        }
      }
    }
    
    // Update order status
    order.orderStatus = status;
    if (notes) order.notes = notes;
    
    if (status === 'delivered') {
      order.actualDelivery = new Date();
    }
    
    await order.save();
    
    const populatedOrder = await Order.findById(order._id)
      .populate('buyer', 'name email phone')
      .populate('farmer', 'name email phone')
      .populate('transporter', 'name phone')
      .populate('products.product', 'name price unit images');
    
    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: populatedOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Assign transporter to order
// @route   PUT /api/v1/orders/:id/assign-transporter
// @access  Private (Farmer or Admin)
exports.assignTransporter = async (req, res, next) => {
  try {
    const { transporterId } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check authorization
    if (order.farmer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to assign transporter'
      });
    }
    
    // Check if order is in a state that can accept transporter assignment
    if (!['confirmed', 'processing'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot assign transporter to order in current status'
      });
    }
    
    // Verify transporter exists and has correct role
    const transporter = await User.findById(transporterId);
    if (!transporter || transporter.role !== 'transporter') {
      return res.status(400).json({
        success: false,
        message: 'Invalid transporter'
      });
    }
    
    order.transporter = transporterId;
    order.orderStatus = 'processing';
    await order.save();
    
    const populatedOrder = await Order.findById(order._id)
      .populate('buyer', 'name email phone')
      .populate('farmer', 'name email phone')
      .populate('transporter', 'name phone');
    
    res.status(200).json({
      success: true,
      message: 'Transporter assigned successfully',
      data: populatedOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add review and rating to order
// @route   PUT /api/v1/orders/:id/review
// @access  Private (Buyer only)
exports.addOrderReview = async (req, res, next) => {
  try {
    const { rating, review } = req.body;
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check authorization - only buyer can review
    if (order.buyer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to review this order'
      });
    }
    
    // Check if order is delivered
    if (order.orderStatus !== 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Can only review delivered orders'
      });
    }
    
    // Check if already reviewed
    if (order.rating) {
      return res.status(400).json({
        success: false,
        message: 'Order already reviewed'
      });
    }
    
    order.rating = rating;
    order.review = review;
    await order.save();
    
    // Update farmer's rating
    await updateUserRating(order.farmer);
    
    res.status(200).json({
      success: true,
      message: 'Review added successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get order statistics
// @route   GET /api/v1/orders/stats/overview
// @access  Private
exports.getOrderStats = async (req, res, next) => {
  try {
    let matchStage = {};
    
    if (req.user.role === 'farmer') {
      matchStage.farmer = req.user._id;
    } else if (req.user.role === 'buyer') {
      matchStage.buyer = req.user._id;
    } else if (req.user.role === 'transporter') {
      matchStage.transporter = req.user._id;
    }
    // Admin can see all orders
    
    const stats = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);
    
    const totalOrders = await Order.countDocuments(matchStage);
    const totalRevenue = await Order.aggregate([
      { $match: { ...matchStage, orderStatus: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        byStatus: stats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Helper function to update user rating
const updateUserRating = async (userId) => {
  const ratingStats = await Order.aggregate([
    { $match: { farmer: userId, rating: { $exists: true } } },
    {
      $group: {
        _id: '$farmer',
        averageRating: { $avg: '$rating' },
        ratingCount: { $sum: 1 }
      }
    }
  ]);
  
  if (ratingStats.length > 0) {
    await User.findByIdAndUpdate(userId, {
      'rating.average': ratingStats[0].averageRating,
      'rating.count': ratingStats[0].ratingCount
    });
  }
};