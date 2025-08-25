const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide product description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide product price'],
    min: [0, 'Price cannot be negative']
  },
  quantity: {
    type: Number,
    required: [true, 'Please provide product quantity'],
    min: [0, 'Quantity cannot be negative']
  },
  unit: {
    type: String,
    enum: ['kg', 'g', 'piece', 'dozen', 'litre', 'pack'],
    required: true
  },
  category: {
    type: String,
    required: [true, 'Please provide product category'],
    enum: [
      'vegetables', 'fruits', 'grains', 'spices', 
      'dairy', 'poultry', 'flowers', 'herbs', 'other'
    ]
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    public_id: {
      type: String,
      required: true
    }
  }],
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    address: String,
    city: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  isOrganic: {
    type: Boolean,
    default: false
  },
  harvestDate: {
    type: Date
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  tags: [String],
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for geospatial queries
productSchema.index({ 'location.coordinates': '2dsphere' });

// Index for text search
productSchema.index({ 
  name: 'text', 
  description: 'text', 
  category: 'text', 
  tags: 'text' 
});

// Virtual for formatted price
productSchema.virtual('formattedPrice').get(function() {
  return `NPR ${this.price.toFixed(2)}/${this.unit}`;
});

// Virtual for availability status
productSchema.virtual('availabilityStatus').get(function() {
  if (this.quantity === 0) return 'Out of Stock';
  if (this.quantity < 10) return 'Low Stock';
  return 'In Stock';
});

module.exports = mongoose.model('Product', productSchema);