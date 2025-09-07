const Order = require('../models/Order');
const Product = require('../models/Product');
const StockTransaction = require('../models/StockTransaction');

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

exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const {
    status,
    vehicleId,
    driverName,
    deliveryStatus,
    location,
    statusNote
  } = req.body;

  const validStatuses = ['Created', 'Confirmed', 'Dispatched', 'Delivered', 'Cancelled'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  const order = await Order.findById(id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  // 🔁 Inventory decrement if status is Dispatched or Delivered
  if (['Dispatched', 'Delivered'].includes(status)) {
    for (const item of order.items) {
      try {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stockQty: -item.quantity }
        });

        await StockTransaction.create({
          product: item.product,
          order: order._id,
          seller: item.sellerId,
          quantity: item.quantity,
          type: 'decrement',
          reason: `Order ${status}`
        });

        global.io.to(`seller:${item.sellerId}`).emit('inventoryUpdated', {
          productId: item.product,
          quantityDecremented: item.quantity
        });
      } catch (err) {
        console.warn(`Inventory update failed for ${item.product}:`, err.message);
      }
    }
  }

  // 🔄 Update order status
  if (status) {
    order.status = status;
  }

  // 🚚 Delivery tracking logic
  if (!order.delivery) order.delivery = {}; // ensure delivery object exists

  if (vehicleId) order.delivery.vehicleId = vehicleId;
  if (driverName) order.delivery.driverName = driverName;
  if (deliveryStatus) {
    order.delivery.deliveryStatus = deliveryStatus;
    if (deliveryStatus === 'Delivered') {
      order.delivery.deliveryDate = new Date();
      order.status = 'Delivered';
    }
  }

  if (location || statusNote) {
    if (!order.delivery.locationUpdates) order.delivery.locationUpdates = [];
    order.delivery.locationUpdates.push({
      timestamp: new Date(),
      location,
      status: statusNote
    });
  }

  await order.save();

  // 🔔 Emit order status update
  if (status) {
    global.io.to('admin').emit('orderStatusUpdated', {
      orderId: order._id,
      newStatus: order.status,
      updatedAt: new Date()
    });
  }

  // 🔔 Emit delivery update
  if (deliveryStatus || location || statusNote) {
    global.io.to('admin').emit('deliveryUpdated', {
      orderId: order._id,
      deliveryStatus: order.delivery.deliveryStatus,
      location,
      statusNote
    });
  }

  res.json({ message: 'Order updated', order });
};