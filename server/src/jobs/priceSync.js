const cron = require('node-cron');
const { syncDailyPrices } = require('../services/priceService');

cron.schedule('0 6 * * *', async () => {
  console.log('🔄 Running daily vegetable price sync...');
  await syncDailyPrices();
});
