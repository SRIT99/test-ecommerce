const Order = require('../models/Order');
const { initiateKhalti, verifyKhalti } = require('../services/khaltiService');

exports.initiateKhaltiPayment = async (req, res) => {
  const { amount, orderId, orderName, customerDetails } = req.body;

  const order = new Order({
    orderId,
    customerDetails,
    paymentMethod: 'Khalti',
    status: 'Initiated'
  });

  await order.save();
  const url = await initiateKhalti({ amount, orderId, orderName });
  res.redirect(url);
};

exports.verifyKhaltiPayment = async (req, res) => {
  const { pidx } = req.query;
  const success = await verifyKhalti(pidx);

  const status = success ? 'Paid' : 'Failed';
  await Order.findOneAndUpdate({ orderId: req.query.purchase_order_id }, { status });

  res.send(`Khalti Payment ${status}`);
};
