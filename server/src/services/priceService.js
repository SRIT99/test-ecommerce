// Placeholder for daily price sync — wire up to real API later
const axios = require('axios');
const Product = require('../models/Product');

exports.syncDailyPrices = async () => {
  // const { data } = await axios.get('https://your-price-api.example.com/daily'); // { name, price }[]
  const data = []; // mock
  if (!Array.isArray(data)) return;
  const ops = data.map(p => ({
    updateOne: {
      filter: { name: p.name },
      update: { $set: { basePrice: p.price, lastPriceSyncAt: new Date() } }
    }
  }));
  if (ops.length) await Product.bulkWrite(ops);
};
