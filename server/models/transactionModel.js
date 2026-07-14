const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    symbol: { type: String },
    type: { type: String, enum: ['BUY', 'SELL', 'DEPOSIT', 'WITHDRAWAL'], required: true },
    shares: { type: Number },
    price: { type: Number },
    totalPrice: { type: Number, required: true },
    paymentMode: { type: String, default: 'virtual_balance' }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual amount mapped to totalPrice
transactionSchema.virtual('amount')
  .get(function() { return this.totalPrice; })
  .set(function(val) { this.totalPrice = val; });

// Virtual time mapped to createdAt string representation
transactionSchema.virtual('time')
  .get(function() { return this.createdAt ? this.createdAt.toISOString() : new Date().toISOString(); });

module.exports = mongoose.model('transactions', transactionSchema);
