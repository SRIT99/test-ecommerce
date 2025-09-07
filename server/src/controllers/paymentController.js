const { baseUrl, esewa } = require('../config/env');
const Order = require('../models/Order');
const Transaction = require('../models/Transaction');
const esewaSvc = require('../services/esewaService');
const khaltiSvc = require('../services/khaltiService');

exports.payEsewa = async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);
  if (!order || order.user.toString() !== req.user._id.toString()) return res.status(404).json({ error: 'Order not found' });

  const pid = order._id.toString();
  const amt = order.totals.grandTotal;
  const params = new URLSearchParams({
    amt, psc: 0, pdc: 0, txAmt: 0, tAmt: amt,
    pid, scd: esewa.merchant,
    su: `${baseUrl}/payments/esewa/verify`,
    fu: `${baseUrl}/payments/esewa/failure`
  });

  await Transaction.create({ order: order._id, user: req.user._id, gateway: 'eSewa', amount: amt, status: 'Initiated' });
  await Order.findByIdAndUpdate(orderId, { 'payment.method': 'eSewa', 'payment.status': 'Initiated', 'payment.pid': pid });

  res.redirect(`${esewaSvc.gatewayBase()}/epay/main?${params.toString()}`);
};

exports.verifyEsewa = async (req, res) => {
  const { amt, pid, rid } = req.query;
  const ok = await esewaSvc.verify({ amt, pid, rid });
  const orderId = pid;

  await Order.findByIdAndUpdate(orderId, {
    'payment.status': ok ? 'Paid' : 'Failed',
    'payment.referenceId': rid
  });

  await Transaction.findOneAndUpdate(
    { order: orderId, gateway: 'eSewa' },
    { status: ok ? 'Completed' : 'Failed', raw: { amt, pid, rid } }
  );

  res.send(ok ? 'eSewa payment successful' : 'eSewa payment failed');
};

exports.payKhalti = async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);
  if (!order || order.user.toString() !== req.user._id.toString()) return res.status(404).json({ error: 'Order not found' });

  const amountPaisa = Math.round(order.totals.grandTotal * 100);
  const url = await khaltiSvc.initiate({
    amountPaisa,
    orderId: order._id.toString(),
    orderName: `Order ${order._id}`
  });

  await Transaction.create({ order: order._id, user: req.user._id, gateway: 'Khalti', amount: order.totals.grandTotal, status: 'Initiated' });
  await Order.findByIdAndUpdate(orderId, { 'payment.method': 'Khalti', 'payment.status': 'Initiated' });

  res.redirect(url);
};

exports.verifyKhalti = async (req, res) => {
  const { pidx } = req.query;
  const result = await khaltiSvc.lookup(pidx);
  const orderId = result?.purchase_order_id;
  const success = result?.status === 'Completed';

  await Order.findByIdAndUpdate(orderId, { 'payment.status': success ? 'Paid' : 'Failed', 'payment.pidx': pidx });
  await Transaction.findOneAndUpdate({ order: orderId, gateway: 'Khalti' }, { status: success ? 'Completed' : 'Failed', raw: result });

  res.send(success ? 'Khalti payment successful' : 'Khalti payment not completed');
};

exports.codPlace = async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);
  if (!order || order.user.toString() !== req.user._id.toString()) return res.status(404).json({ error: 'Order not found' });

  await Order.findByIdAndUpdate(orderId, { 'payment.method': 'COD', 'payment.status': 'Pending' });
  await Transaction.create({ order: order._id, user: req.user._id, gateway: 'COD', amount: order.totals.grandTotal, status: 'Initiated' });

  res.json({ message: 'COD placed, pay on delivery' });
};
