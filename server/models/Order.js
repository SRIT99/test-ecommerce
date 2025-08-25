const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    required: true
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  shippingAddress: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  paymentMethod: {
    type: String,
    enum: ['esewa', 'khalti', 'cash_on_delivery'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: [
      'pending', 'confirmed', 'processing', 
      'shipped', 'delivered', 'cancelled'
    ],
    default: 'pending'
  },
  transporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  deliveryFee: {
    type: Number,
    default: 0
  },
  estimatedDelivery: Date,
  actualDelivery: Date,
  notes: String,
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: String
}, {
  timestamps: true
});

// Generate order ID before saving
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderId = `DOKO${(count + 1).toString().padStart(6, '0')}`;
  }
  next();
});

// Virtual for order summary
orderSchema.virtual('summary').get(function() {
  return `${this.products.length} item(s) - NPR ${this.totalAmount}`;
});

module.exports = mongoose.model('Order', orderSchema);