const mongoose = require('mongoose');

const stockTxnSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  quantity: Number,
  type: { type: String, enum: ['decrement', 'increment'], required: true },
  reason: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StockTransaction', stockTxnSchema);
