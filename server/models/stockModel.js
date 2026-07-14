const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    symbol: { type: String, required: true, unique: true, index: true },
    companyName: { type: String, required: true },
    exchange: { type: String },
    sector: { type: String },
    industry: { type: String },
    price: { type: Number, required: true },
    change: { type: Number, default: 0 },
    marketCap: { type: String },
    volume: { type: String },
    currency: { type: String, default: 'USD' }
}, { timestamps: true });

module.exports = mongoose.model('stocks', stockSchema);
