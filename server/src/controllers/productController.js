const Product = require('../models/Product');

exports.create = async (req, res) => {
  // Accept all relevant fields from frontend
  const {
    name,
    price,
    unit,
    category,
    description,
    imageUrl,
    region,
    stockQty
  } = req.body;

  // 🔐 Block unverified sellers
  if (req.user.userType === 'seller' && !req.user.isVerified) {
    return res.status(403).json({ error: 'Seller not verified by admin' });
  }

  // Validate required fields
  if (!name || !price) return res.status(400).json({ error: 'Missing fields' });

  // Create product with all fields
  const product = await Product.create({
    name,
    price,
    unit,
    category,
    description,
    imageUrl,
    region,
    stockQty: stockQty || 0,
    sellerId: req.user._id,
    sellerName: req.user.name,
    lastPriceSyncAt: new Date()
  });
  res.status(201).json(product);
};

exports.listPublic = async (_req, res) => {
  const products = await Product.find({ isActive: true }).select('-__v');
  res.json(products);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findOneAndUpdate(
    { _id: id, sellerId: req.user._id },
    req.body,
    { new: true }
  );
  if (!product) return res.status(404).json({ error: 'Not found' });
  res.json(product);
};
