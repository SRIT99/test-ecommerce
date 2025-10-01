const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    enum: ['buyer', 'seller', 'admin', 'superadmin'],
    default: 'buyer'
  },
  phone: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  // Farmer-specific fields
  bio: {
    type: String,
    default: ''
  },
  farmName: {
    type: String,
    default: ''
  },
  farmSize: {
    type: String,
    default: ''
  },
  certifications: [{
    type: String
  }]
}, {
  timestamps: true
});

// Add instance methods for role checking
userSchema.methods.isAdmin = function() {
  return ['admin', 'superadmin'].includes(this.userType);
};

userSchema.methods.isSuperAdmin = function() {
  return this.userType === 'superadmin';
};

userSchema.methods.canManageUsers = function() {
  return ['admin', 'superadmin'].includes(this.userType);
};

userSchema.methods.canManageSystem = function() {
  return this.userType === 'superadmin';
};

module.exports = mongoose.model('User', userSchema);