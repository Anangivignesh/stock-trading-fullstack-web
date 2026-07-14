const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    symbol: { type: String, required: true },
    name: { type: String, required: true },
    shares: { type: Number, required: true, default: 0 },
    avgCost: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true, default: 0 }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual count mapped to shares
portfolioSchema.virtual('count')
  .get(function() { return this.shares; })
  .set(function(val) { this.shares = val; });

// Virtual price mapped to avgCost
portfolioSchema.virtual('price')
  .get(function() { return this.avgCost; })
  .set(function(val) { this.avgCost = val; });

module.exports = mongoose.model('portfolios', portfolioSchema);
