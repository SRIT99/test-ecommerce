// backend/models/MarketPrice.js
const mongoose = require('mongoose');

const marketPriceSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    trim: true
  },
  retailPrice: {
    type: Number,
    required: true
  },
  wholesalePrice: {
    type: Number
  },
  unit: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['vegetable', 'fruit', 'grain', 'spice', 'other'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

marketPriceSchema.index({ productName: 1, timestamp: -1 });
marketPriceSchema.index({ category: 1, timestamp: -1 });

module.exports = mongoose.model('MarketPrice', marketPriceSchema);