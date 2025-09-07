const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;
  if (!items?.length) return res.status(400).json({ error: 'No items' });
  if (!['eSewa', 'Khalti', 'COD'].includes(paymentMethod)) {
    return res.status(400).json({ error: 'Invalid payment method' });
  }

  const ids = items.map(i => i.productId);
  const dbProducts = await Product.find({ _id: { $in: ids }, isActive: true });
  if (dbProducts.length !== ids.length) return res.status(400).json({ error: 'Some products unavailable' });

  const lineItems = items.map(i => {
    const p = dbProducts.find(d => d._id.toString() === i.productId);
    return { product: p._id, name: p.name, unitPrice: p.basePrice, quantity: i.quantity, sellerId: p.sellerId };
  });

  const subTotal = lineItems.reduce((s, li) => s + li.unitPrice * li.quantity, 0);
  const shipping = 0;
  const grandTotal = subTotal + shipping;

  const order = await Order.create({
    user: req.user._id,
    items: lineItems,
    totals: { subTotal, shipping, grandTotal },
    payment: { method: paymentMethod, status: paymentMethod === 'COD' ? 'Pending' : 'Initiated' },
    shippingAddress
  });

  res.status(201).json(order);
};

exports.myOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};
