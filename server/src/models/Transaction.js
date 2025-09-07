const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  gateway: { type: String, enum: ['eSewa', 'Khalti', 'COD'] },
  amount: Number,
  direction: { type: String, enum: ['debit', 'credit'], default: 'debit' },
  status: { type: String, enum: ['Initiated', 'Completed', 'Failed'], default: 'Initiated' },
  raw: mongoose.Schema.Types.Mixed
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
