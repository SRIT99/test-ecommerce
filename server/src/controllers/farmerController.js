const Order = require('../models/Order');
const Product = require('../models/Product');
const StockTransaction = require('../models/StockTransaction');
const User = require('../models/User');

// Get farmer dashboard stats
exports.getFarmerStats = async (req, res) => {
  try {
    const farmerId = req.user._id;

    // Total products
    const totalProducts = await Product.countDocuments({ sellerId: farmerId });
    
    // Active products
    const activeProducts = await Product.countDocuments({ 
      sellerId: farmerId, 
      isActive: true,
      stockQty: { $gt: 0 }
    });

    // Total orders
    const totalOrders = await Order.countDocuments({
      'items.sellerId': farmerId
    });

    // Pending orders
    const pendingOrders = await Order.countDocuments({
      'items.sellerId': farmerId,
      status: { $in: ['Created', 'Confirmed'] }
    });

    // Total sales revenue
    const salesData = await Order.aggregate([
      { $match: { 'items.sellerId': farmerId, status: 'Delivered' } },
      { $unwind: '$items' },
      { $match: { 'items.sellerId': farmerId } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $multiply: ['$items.unitPrice', '$items.quantity'] } },
          totalItemsSold: { $sum: '$items.quantity' }
        }
      }
    ]);

    const totalRevenue = salesData.length > 0 ? salesData[0].totalRevenue : 0;
    const totalItemsSold = salesData.length > 0 ? salesData[0].totalItemsSold : 0;

    // Recent orders
    const recentOrders = await Order.find({
      'items.sellerId': farmerId
    })
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(5);

    // Low stock products
    const lowStockProducts = await Product.find({
      sellerId: farmerId,
      stockQty: { $lt: 10 },
      isActive: true
    }).limit(5);

    res.json({
      stats: {
        totalProducts,
        activeProducts,
        totalOrders,
        pendingOrders,
        totalRevenue,
        totalItemsSold
      },
      recentOrders,
      lowStockProducts
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch farmer stats' });
  }
};

// Get farmer's products with pagination
exports.getFarmerProducts = async (req, res) => {
  try {
    const farmerId = req.user._id;
    const { page = 1, limit = 10, search = '' } = req.query;

    const query = { 
      sellerId: farmerId 
    };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Update farmer profile
exports.updateFarmerProfile = async (req, res) => {
  try {
    const farmerId = req.user._id;
    const { name, phone, location, bio, farmName } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      farmerId,
      { 
        name, 
        phone, 
        location,
        bio,
        farmName 
      },
      { new: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// Get farmer's orders
exports.getFarmerOrders = async (req, res) => {
  try {
    const farmerId = req.user._id;
    const { status, page = 1, limit = 10 } = req.query;

    let query = { 'items.sellerId': farmerId };

    if (status && status !== 'all') {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('user', 'name email phone location')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    // Calculate total sales for farmer
    const salesData = await Order.aggregate([
      { $match: { 'items.sellerId': farmerId, status: 'Delivered' } },
      { $unwind: '$items' },
      { $match: { 'items.sellerId': farmerId } },
      {
        $group: {
          _id: null,
          totalSales: { $sum: { $multiply: ['$items.unitPrice', '$items.quantity'] } }
        }
      }
    ]);

    const totalSales = salesData.length > 0 ? salesData[0].totalSales : 0;

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      totalSales
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};