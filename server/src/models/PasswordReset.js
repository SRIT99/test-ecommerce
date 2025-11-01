// models/PasswordReset.js
const mongoose = require('mongoose');

const passwordResetSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  token: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: '1h' } // Auto delete after 1 hour
  }
}, {
  timestamps: true
});

// Compound index for faster queries
passwordResetSchema.index({ email: 1, token: 1 });

module.exports = mongoose.model('PasswordReset', passwordResetSchema);