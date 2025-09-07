const Order = require('../models/Order');

exports.placeCODOrder = async (req, res) => {
  const { orderId, customerDetails } = req.body;
  console.log(req.body);

  if (!orderId || !customerDetails?.name || !customerDetails?.address || !customerDetails?.phone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const existing = await Order.findOne({ orderId });
  if (existing) return res.status(409).json({ error: 'Order ID already exists' });

  const order = new Order({
    orderId,
    customerDetails,
    paymentMethod: 'Cash on Delivery',
    status: 'Pending Payment'
  });

  await order.save();
  res.status(201).json({ message: 'COD Order Placed', order });
};
