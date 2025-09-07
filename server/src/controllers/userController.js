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
