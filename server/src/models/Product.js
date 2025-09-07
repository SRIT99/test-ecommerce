const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: String,
  rating: Number,
  comment: String
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  category: { type: String, default: 'vegetable' },
  price: { type: Number, required: true }, // added for frontend integration
  unit: { type: String, default: 'kg' }, // e.g. kg, piece
  description: { type: String },
  imageUrl: { type: String },
  region: { type: String },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // remove required: true
  sellerName: { type: String }, // for display
  stockQty: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  lastPriceSyncAt: { type: Date },
  reviews: [reviewSchema], // array of reviews
  averageRating: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

