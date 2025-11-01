// backend/models/PriceHistory.js
const mongoose = require('mongoose');

const priceHistorySchema = new mongoose.Schema({
  syncedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productsUpdated: {
    type: Number,
    required: true
  },
  averageChange: {
    type: Number,
    required: true
  },
  details: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    oldPrice: Number,
    newPrice: Number,
    change: Number
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('PriceHistory', priceHistorySchema);