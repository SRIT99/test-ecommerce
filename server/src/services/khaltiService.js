const axios = require('axios');
const { baseUrl, khalti } = require('../config/env');

exports.initiate = async ({ amountPaisa, orderId, orderName }) => {
  const resp = await axios.post('https://a.khalti.com/api/v2/epayment/initiate/', {
    return_url: `${baseUrl}/payments/khalti/verify`,
    website_url: baseUrl,
    amount: amountPaisa,
    purchase_order_id: orderId,
    purchase_order_name: orderName
  }, { headers: { Authorization: khalti.secret } });
  return resp.data.payment_url;
};

exports.lookup = async (pidx) => {
  const resp = await axios.post('https://a.khalti.com/api/v2/epayment/lookup/', { pidx }, {
    headers: { Authorization: khalti.secret }
  });
  return resp.data; // contains status, purchase_order_id, etc.
};
