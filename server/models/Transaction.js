const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    unique: true,
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ['esewa', 'khalti', 'cash_on_delivery'],
    required: true
  },
  paymentGateway: {
    // For digital payments, store gateway-specific data
    name: {
      type: String,
      enum: ['esewa', 'khalti', null],
      default: null
    },
    transactionId: String,
    statusCode: String,
    statusMessage: String,
    rawResponse: mongoose.Schema.Types.Mixed
  },
  status: {
    type: String,
    enum: [
      'initiated', 
      'pending', 
      'completed', 
      'failed', 
      'refunded', 
      'cancelled'
    ],
    default: 'initiated'
  },
  currency: {
    type: String,
    default: 'NPR'
  },
  description: {
    type: String,
    maxlength: 500
  },
  metadata: {
    ipAddress: String,
    userAgent: String,
    deviceType: String
  },
  refund: {
    amount: {
      type: Number,
      default: 0
    },
    reason: String,
    processedAt: Date,
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  failureReason: {
    code: String,
    message: String,
    details: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Generate transaction ID before saving
transactionSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Transaction').countDocuments();
    this.transactionId = `TXN${(count + 1).toString().padStart(8, '0')}`;
  }
  next();
});

// Index for better query performance
transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ order: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ 'paymentGateway.transactionId': 1 });

// Virtual for formatted amount
transactionSchema.virtual('formattedAmount').get(function() {
  return `NPR ${this.amount.toFixed(2)}`;
});

// Static method to get transaction statistics
transactionSchema.statics.getStats = async function(userId = null) {
  const matchStage = userId ? { user: mongoose.Types.ObjectId(userId) } : {};
  
  const stats = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalTransactions: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        completedTransactions: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        completedAmount: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$amount', 0] }
        },
        failedTransactions: {
          $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
        },
        refundedTransactions: {
          $sum: { $cond: [{ $eq: ['$status', 'refunded'] }, 1, 0] }
        },
        refundedAmount: {
          $sum: { $cond: [{ $eq: ['$status', 'refunded'] }, '$amount', 0] }
        }
      }
    }
  ]);
  
  return stats[0] || {
    totalTransactions: 0,
    totalAmount: 0,
    completedTransactions: 0,
    completedAmount: 0,
    failedTransactions: 0,
    refundedTransactions: 0,
    refundedAmount: 0
  };
};

// Method to check if transaction can be refunded
transactionSchema.methods.canRefund = function() {
  return this.status === 'completed' && 
         this.refund.amount < this.amount &&
         Date.now() - this.createdAt < 30 * 24 * 60 * 60 * 1000; // 30 days
};

// Method to process refund
transactionSchema.methods.processRefund = async function(amount, reason, processedBy) {
  if (!this.canRefund()) {
    throw new Error('Transaction cannot be refunded');
  }
  
  const refundAmount = amount || this.amount - this.refund.amount;
  
  if (refundAmount > this.amount - this.refund.amount) {
    throw new Error('Refund amount exceeds available balance');
  }
  
  this.refund.amount += refundAmount;
  this.refund.reason = reason;
  this.refund.processedBy = processedBy;
  this.refund.processedAt = new Date();
  
  if (this.refund.amount >= this.amount) {
    this.status = 'refunded';
  }
  
  return this.save();
};

module.exports = mongoose.model('Transaction', transactionSchema);