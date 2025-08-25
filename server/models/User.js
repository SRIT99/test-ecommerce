const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Please provide your phone number'],
    validate: {
      validator: function(v) {
        return /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(v);
      },
      message: 'Please provide a valid phone number'
    }
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['farmer', 'buyer', 'transporter', 'admin'],
    required: true,
    default: 'buyer'
  },
  avatar: {
    type: String,
    default: 'default-avatar.jpg'
  },
  avatarPublicId: {
    type: String,
    default: null
  },
  location: {
    address: {
      type: String,
      required: [true, 'Please provide your address']
    },
    city: {
      type: String,
      required: [true, 'Please provide your city']
    },
    coordinates: {
      lat: {
        type: Number,
        required: [true, 'Please provide latitude coordinates']
      },
      lng: {
        type: Number,
        required: [true, 'Please provide longitude coordinates']
      }
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
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
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],
  deliveries: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    },
    language: { type: String, default: 'en' },
    currency: { type: String, default: 'NPR' }
  },
  stats: {
    totalOrders: { type: Number, default: 0 },
    completedOrders: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 }
  },
  lastLogin: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  deactivationReason: String,
  deactivatedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for geospatial queries
userSchema.index({ 'location.coordinates': '2dsphere' });

// Index for text search
userSchema.index({ 
  name: 'text', 
  email: 'text', 
  'location.address': 'text',
  'location.city': 'text'
});

// Index for common queries
userSchema.index({ role: 1, isVerified: 1, isActive: 1 });
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });

// Virtual for formatted address
userSchema.virtual('formattedAddress').get(function() {
  return `${this.location.address}, ${this.location.city}`;
});

// Virtual for user status
userSchema.virtual('status').get(function() {
  if (!this.isActive) return 'inactive';
  if (!this.isVerified) return 'unverified';
  return 'active';
});

// Virtual for recent activity
userSchema.virtual('recentActivity').get(function() {
  return {
    lastLogin: this.lastLogin,
    productCount: this.products.length,
    orderCount: this.orders.length
  };
});

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();
  
  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Update last login timestamp
userSchema.pre('save', function(next) {
  if (this.isModified('lastLogin')) {
    this.lastLogin = new Date();
  }
  next();
});

// Compare password method
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Generate password reset token
userSchema.methods.getResetPasswordToken = function() {
  const resetToken = crypto.randomBytes(20).toString('hex');
  
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return resetToken;
};

// Generate verification token
userSchema.methods.generateVerificationToken = function() {
  const verificationToken = crypto.randomBytes(20).toString('hex');
  
  this.verificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
    
  return verificationToken;
};

// Check if user can be deleted
userSchema.methods.canBeDeleted = async function() {
  // Check if user has active products
  const activeProducts = await mongoose.model('Product').countDocuments({
    farmer: this._id,
    isAvailable: true
  });
  
  // Check if user has active orders
  const activeOrders = await mongoose.model('Order').countDocuments({
    $or: [{ buyer: this._id }, { farmer: this._id }],
    orderStatus: { $in: ['pending', 'confirmed', 'processing', 'shipped'] }
  });
  
  return activeProducts === 0 && activeOrders === 0;
};

// Update user rating
userSchema.methods.updateRating = async function() {
  const ratingStats = await mongoose.model('Order').aggregate([
    { 
      $match: { 
        farmer: this._id, 
        rating: { $exists: true, $gte: 1, $lte: 5 } 
      } 
    },
    {
      $group: {
        _id: '$farmer',
        averageRating: { $avg: '$rating' },
        ratingCount: { $sum: 1 }
      }
    }
  ]);
  
  if (ratingStats.length > 0) {
    this.rating.average = parseFloat(ratingStats[0].averageRating.toFixed(1));
    this.rating.count = ratingStats[0].ratingCount;
  } else {
    this.rating.average = 0;
    this.rating.count = 0;
  }
  
  await this.save();
};

// Get user statistics
userSchema.methods.getStats = async function() {
  if (this.role === 'farmer') {
    // Farmer statistics
    const farmerStats = await mongoose.model('Order').aggregate([
      { $match: { farmer: this._id } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          completedOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'delivered'] }, 1, 0] }
          },
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);
    
    this.stats = farmerStats[0] || {
      totalOrders: 0,
      completedOrders: 0,
      totalRevenue: 0
    };
  } else if (this.role === 'buyer') {
    // Buyer statistics
    const buyerStats = await mongoose.model('Order').aggregate([
      { $match: { buyer: this._id } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          completedOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'delivered'] }, 1, 0] }
          },
          totalSpent: { $sum: '$totalAmount' }
        }
      }
    ]);
    
    this.stats = buyerStats[0] || {
      totalOrders: 0,
      completedOrders: 0,
      totalSpent: 0
    };
  } else if (this.role === 'transporter') {
    // Transporter statistics
    const transporterStats = await mongoose.model('Order').aggregate([
      { $match: { transporter: this._id } },
      {
        $group: {
          _id: null,
          totalDeliveries: { $sum: 1 },
          completedDeliveries: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'delivered'] }, 1, 0] }
          },
          totalEarnings: { $sum: '$deliveryFee' }
        }
      }
    ]);
    
    this.stats = transporterStats[0] || {
      totalDeliveries: 0,
      completedDeliveries: 0,
      totalEarnings: 0
    };
  }
  
  await this.save();
  return this.stats;
};

// Deactivate user account
userSchema.methods.deactivate = async function(reason = 'User requested') {
  this.isActive = false;
  this.deactivationReason = reason;
  this.deactivatedAt = new Date();
  
  // Also deactivate user's products
  await mongoose.model('Product').updateMany(
    { farmer: this._id },
    { isAvailable: false }
  );
  
  await this.save();
};

// Reactivate user account
userSchema.methods.reactivate = async function() {
  this.isActive = true;
  this.deactivationReason = undefined;
  this.deactivatedAt = undefined;
  
  await this.save();
};

// Check if user is nearby (within specified distance)
userSchema.methods.isNearby = function(lat, lng, maxDistanceKm = 50) {
  if (!this.location.coordinates || !this.location.coordinates.lat || !this.location.coordinates.lng) {
    return false;
  }
  
  const R = 6371; // Earth's radius in km
  const dLat = this.deg2rad(lat - this.location.coordinates.lat);
  const dLon = this.deg2rad(lng - this.location.coordinates.lng);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(this.deg2rad(this.location.coordinates.lat)) * 
    Math.cos(this.deg2rad(lat)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance <= maxDistanceKm;
};

// Helper method to convert degrees to radians
userSchema.methods.deg2rad = function(deg) {
  return deg * (Math.PI/180);
};

// Static method to find nearby users
userSchema.statics.findNearby = async function(lat, lng, maxDistanceKm = 50, role = null) {
  const query = {
    'location.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(lng), parseFloat(lat)]
        },
        $maxDistance: maxDistanceKm * 1000
      }
    },
    isActive: true,
    isVerified: true
  };
  
  if (role) {
    query.role = role;
  }
  
  return this.find(query);
};

// Static method to get user statistics
userSchema.statics.getUserStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 },
        activeCount: {
          $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
        },
        verifiedCount: {
          $sum: { $cond: [{ $eq: ['$isVerified', true] }, 1, 0] }
        },
        averageRating: { $avg: '$rating.average' }
      }
    },
    { $sort: { count: -1 } }
  ]);
  
  const totalUsers = await this.countDocuments();
  const totalActive = await this.countDocuments({ isActive: true });
  const totalVerified = await this.countDocuments({ isVerified: true });
  
  return {
    totalUsers,
    totalActive,
    totalVerified,
    byRole: stats
  };
};

// Query middleware to exclude inactive users by default
userSchema.pre(/^find/, function(next) {
  this.find({ isActive: { $ne: false } });
  next();
});

// Query middleware to populate products and orders for user profile
userSchema.pre(/^find/, function(next) {
  if (this.options.populateProfile) {
    this.populate({
      path: 'products',
      select: 'name price category images isAvailable',
      options: { limit: 5, sort: { createdAt: -1 } }
    }).populate({
      path: 'orders',
      select: 'orderId totalAmount orderStatus createdAt',
      options: { limit: 5, sort: { createdAt: -1 } }
    });
  }
  next();
});

module.exports = mongoose.model('User', userSchema);