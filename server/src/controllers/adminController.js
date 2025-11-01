// backend/controllers/adminController.js
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const PriceHistory = require('../models/PriceHistory');

// Get admin dashboard stats
exports.getStats = async (req, res) => {
  try {
    // Total users count
    const totalUsers = await User.countDocuments();
    
    // Total products count
    const totalProducts = await Product.countDocuments({ isActive: true });
    
    // Total orders count
    const totalOrders = await Order.countDocuments();
    
    // Total revenue (from delivered orders)
    const revenueData = await Order.aggregate([
      { $match: { status: 'Delivered' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totals.grandTotal' } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;
    
    // Pending farmer verifications
    const pendingVerifications = await User.countDocuments({ 
      userType: 'seller', 
      isVerified: false 
    });
    
    // Active farmers count
    const activeFarmers = await User.countDocuments({ 
      userType: 'seller', 
      isVerified: true 
    });

    // Recent activities (last 10 activities)
    const recentActivities = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name userType createdAt')
      .then(users => users.map(user => ({
        type: 'user',
        message: `New ${user.userType} registered: ${user.name}`,
        timestamp: user.createdAt
      })));

    res.json({
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        pendingVerifications,
        activeFarmers
      },
      recentActivities
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
};

// Get platform analytics
exports.getAnalytics = async (req, res) => {
  try {
    // User growth (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Revenue trends (last 30 days)
    const revenueTrends = await Order.aggregate([
      {
        $match: {
          status: 'Delivered',
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          revenue: { $sum: '$totals.grandTotal' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Top products
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.unitPrice', '$items.quantity'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      }
    ]);

    // Order metrics
    const orderMetrics = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      userGrowth,
      revenueTrends,
      topProducts,
      orderMetrics
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};

// Get recent activities
exports.getRecentActivities = async (req, res) => {
  try {
    // Get recent users, orders, and products
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name userType createdAt');

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name')
      .select('_id status totals createdAt');

    const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name price createdAt');

    const activities = [
      ...recentUsers.map(user => ({
        type: 'user',
        message: `New ${user.userType} registered: ${user.name}`,
        timestamp: user.createdAt,
        user: { name: user.name, type: user.userType }
      })),
      ...recentOrders.map(order => ({
        type: 'order',
        message: `New order ${order._id} placed by ${order.user?.name || 'Customer'}`,
        timestamp: order.createdAt,
        order: { id: order._id, status: order.status }
      })),
      ...recentProducts.map(product => ({
        type: 'product',
        message: `New product listed: ${product.name}`,
        timestamp: product.createdAt,
        product: { name: product.name, price: product.price }
      }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
     .slice(0, 20);

    res.json({ activities });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
};

// Get system status
exports.getSystemStatus = async (req, res) => {
  try {
    // Check database connection
    const dbStatus = await User.findOne() ? 'healthy' : 'unhealthy';

    // Mock system metrics (in real app, you'd get these from system monitoring)
    res.json({
      server: 'online',
      database: dbStatus,
      apiResponseTime: Math.floor(Math.random() * 100) + 50, // Mock response time
      activeSessions: Math.floor(Math.random() * 50) + 10, // Mock active sessions
      lastBackup: new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 hours ago
    });
  } catch (error) {
    console.error('Get system status error:', error);
    res.status(500).json({ error: 'Failed to fetch system status' });
  }
};

// Get all users with filters
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, userType, search } = req.query;
    
    let query = {};
    if (userType && userType !== 'all') query.userType = userType;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Verify user (farmer)
exports.verifyUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Verify user error:', error);
    res.status(500).json({ error: 'Failed to verify user' });
  }
};

// Suspend user
exports.suspendUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Suspend user error:', error);
    res.status(500).json({ error: 'Failed to suspend user' });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// Get all products with filters
exports.getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    
    let query = { isActive: true };
    if (category && category !== 'all') query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query)
      .populate('sellerId', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

// Get all orders with filters
exports.getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    
    let query = {};
    if (status && status !== 'all') query.status = status;
    if (search) {
      query.$or = [
        { _id: { $regex: search, $options: 'i' } }
      ];
    }

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// Get order analytics
exports.getOrderAnalytics = async (req, res) => {
  try {
    // Order status distribution
    const statusDistribution = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Monthly revenue
    const monthlyRevenue = await Order.aggregate([
      {
        $match: { status: 'Delivered' }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totals.grandTotal' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      statusDistribution,
      monthlyRevenue
    });
  } catch (error) {
    console.error('Get order analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch order analytics' });
  }
};

// Sync prices
exports.syncPrices = async (req, res) => {
  try {
    // Mock price sync functionality
    // In real implementation, this would fetch from external APIs
    
    // Create price history record
    const priceHistory = await PriceHistory.create({
      syncedBy: req.user._id,
      productsUpdated: Math.floor(Math.random() * 50) + 10,
      averageChange: (Math.random() * 10 - 5).toFixed(2) // Random change between -5% to +5%
    });

    res.json({
      message: 'Prices synced successfully',
      syncId: priceHistory._id,
      productsUpdated: priceHistory.productsUpdated,
      averageChange: priceHistory.averageChange
    });
  } catch (error) {
    console.error('Sync prices error:', error);
    res.status(500).json({ error: 'Failed to sync prices' });
  }
};

// Get price history
exports.getPriceHistory = async (req, res) => {
  try {
    const priceHistory = await PriceHistory.find()
      .populate('syncedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(priceHistory);
  } catch (error) {
    console.error('Get price history error:', error);
    res.status(500).json({ error: 'Failed to fetch price history' });
  }
};

// Generate reports
exports.generateReport = async (req, res) => {
  try {
    const { type } = req.params;
    const { startDate, endDate } = req.query;

    // Mock report generation
    // In real implementation, generate CSV/PDF reports
    
    res.json({
      type,
      startDate,
      endDate,
      generatedAt: new Date(),
      downloadUrl: `/reports/${type}-${Date.now()}.csv` // Mock URL
    });
  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
};

// Send broadcast notification
exports.sendBroadcast = async (req, res) => {
  try {
    const { message, userType } = req.body;

    // Mock broadcast functionality
    // In real implementation, this would send emails/push notifications
    
    res.json({
      message: 'Broadcast sent successfully',
      recipients: userType === 'all' ? 'All users' : userType,
      message: message.substring(0, 100) + '...'
    });
  } catch (error) {
    console.error('Send broadcast error:', error);
    res.status(500).json({ error: 'Failed to send broadcast' });
  }
};