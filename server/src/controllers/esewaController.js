const Order = require('../models/Order');
const { verifyEsewaTransaction } = require('../services/esewaService');

exports.initiateEsewaPayment = (req, res) => {
  const { amount, pid, customerDetails } = req.body;

  const params = new URLSearchParams({
    amt: amount,
    psc: 0,
    pdc: 0,
    txAmt: 0,
    tAmt: amount,
    pid,
    scd: process.env.ESEWA_MERCHANT_CODE,
    su: 'http://localhost:5000/esewa/verify',
    fu: 'http://localhost:5000/esewa/failure'
  });

  const order = new Order({
    orderId: pid,
    customerDetails,
    paymentMethod: 'eSewa',
    status: 'Initiated'
  });

  order.save();
  res.redirect(`https://rc.esewa.com.np/epay/main?${params.toString()}`);
};

exports.verifyEsewaPayment = async (req, res) => {
  const { amt, pid, rid } = req.query;
  const success = await verifyEsewaTransaction({ amt, pid, rid });

  const status = success ? 'Paid' : 'Failed';
  await Order.findOneAndUpdate({ orderId: pid }, { status });

  res.send(`eSewa Payment ${status}`);
};
