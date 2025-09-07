// Placeholder for daily price sync — wire up to real API later
const axios = require('axios');
const Product = require('../models/Product');

exports.syncDailyPrices = async () => {
  try {
    // Replace with your real API endpoint
    // const { data } = await axios.get('https://api.example.com/daily-veg-prices');

    //suppose this is the data we got from the API
    const data = [{ name: 'Tomato', price: 90 }, { name: 'Potato', price: 60 }, { name: 'Onion', price: 70 }, { name: 'Cabbage', price: 50 }, { name: 'Carrot', price: 80 }, { name: 'Spinach', price: 40 }, { name: 'Broccoli', price: 120 }, { name: 'Cauliflower', price: 110 }, { name: 'Cucumber', price: 30 }, { name: 'Bell Pepper', price: 150 }];
    const updates = data.map(item => ({
      updateOne: {
        filter: { name: item.name },
        update: {
          $set: {
            basePrice: item.price,
            lastPriceSyncAt: new Date()
          }
        }
      }
    }));

    if (updates.length > 0) {
      await Product.bulkWrite(updates);
      return { updated: updates.length };
    }

    return { updated: 0 };
  } catch (err) {
    console.error('Price sync failed:', err.message);
    throw err;
  }
};

