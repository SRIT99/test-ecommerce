//to control daily prices of the products.
const { syncDailyPrices } = require('../services/priceService');

exports.triggerPriceSync = async (_req, res) => {
  try {
    const result = await syncDailyPrices();
    console.log('Price sync result:', result);
    res.json({ message: 'Price sync completed', ...result });
  } catch {
    res.status(500).json({ error: 'Failed to sync prices' });
  }
};