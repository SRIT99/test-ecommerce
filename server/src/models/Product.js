const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: String,
  rating: Number,
  comment: String
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    index: true,
    trim: true 
  },
  category: { 
    type: String, 
    default: 'vegetable',
    enum: ['vegetable', 'fruit', 'grain', 'dairy', 'spice', 'other']
  },
  price: { 
    type: Number, 
    required: true 
  },
  basePrice: { 
    type: Number, 
    required: true 
  },
  unit: { 
    type: String, 
    default: 'kg',
    enum: ['kg', 'g', 'piece', 'bunch', 'dozen', 'packet', 'liter']
  },
  description: { 
    type: String,
    maxlength: 1000 
  },
  imageUrl: { 
    type: String 
  },
  region: { 
    type: String,
    required: true 
  },
  sellerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  sellerName: { 
    type: String 
  },
  stockQty: { 
    type: Number, 
    default: 0,
    min: 0 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  lastPriceSyncAt: { 
    type: Date 
  },
  reviews: [reviewSchema],
  averageRating: { 
    type: Number, 
    default: 0,
    min: 0,
    max: 5 
  }
}, { 
  timestamps: true 
});

// Index for better query performance
productSchema.index({ sellerId: 1, createdAt: -1 });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ region: 1, isActive: 1 });

module.exports = mongoose.model('Product', productSchema);