// src/models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: { 
    type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: String,
    unitPrice: Number,
    quantity: Number,
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  totals: {
    subTotal: { type: Number, required: true },
    shipping: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    currency: { type: String, default: 'NPR' }
  },
  payment: {
    method: {
      type: String,
      enum: ['eSewa', 'Khalti', 'COD'],
      required: true
    },
    status: {
      type: String,
      enum: ['Initiated', 'Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Initiated'
    },
    pid: String,   // eSewa product/order ID
    pidx: String,  // Khalti payment index
    referenceId: String // Gateway transaction ID
  },
  status: {
    type: String,
    enum: ['Created', 'Confirmed', 'Dispatched', 'Delivered', 'Cancelled'],
    default: 'Created'
  },
  shippingAddress: {
    name: { type: String },
    phone: { type: String },
    address: { type: String }
  },
  delivery: {
  vehicleId: { type: String },
  driverName: { type: String },
  deliveryStatus: {
    type: String,
    enum: ['Pending', 'OutForDelivery', 'Delivered', 'Failed'],
    default: 'Pending'
  },
  deliveryDate: { type: Date },
  locationUpdates: [{
    timestamp: Date,
    location: String,
    status: String
  }],
  notes: String
}

}, { timestamps: true });

orderSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
