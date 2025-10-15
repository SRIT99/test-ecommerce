const User = require('../models/User');

exports.me = async (req, res) => {
  const u = await User.findById(req.user._id).select('-password');
  res.json(u);
};

exports.listUsers = async (_req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
};

exports.verifyUser = async (req, res) => {
  const { id } = req.params;
  const u = await User.findByIdAndUpdate(id, { isVerified: true }, { new: true }).select('-password');
  console.log(u)
  if (!u) return res.status(404).json({ error: 'User not found' });
  res.json(u);
};
// Add to userController.js
exports.getBuyerDashboard = async (req, res) => {
  try {
    const buyerId = req.user._id;
    
    const [totalOrders, pendingOrders, totalSpent, recentOrders] = await Promise.all([
      Order.count({ user: buyerId }),
      Order.count({ user: buyerId, status: { $in: ['Created', 'Confirmed', 'Dispatched'] } }),
      Order.aggregate([
        { $match: { user: buyerId, status: 'Delivered' } },
        { $group: { _id: null, total: { $sum: '$totals.grandTotal' } } }
      ]),
      Order.find({ user: buyerId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('items.product', 'name imageUrl')
    ]);
    
    res.json({
      stats: {
        totalOrders,
        pendingOrders,
        totalSpent: totalSpent[0]?.total || 0
      },
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
};