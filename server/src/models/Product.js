const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  category: { type: String, default: 'vegetable' },
  basePrice: { type: Number, required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stockQty: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  lastPriceSyncAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

