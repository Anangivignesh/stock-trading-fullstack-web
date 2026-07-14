const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    symbol: { type: String, required: true },
    name: { type: String },
    price: { type: Number, required: true },
    count: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    stockType: { type: String, default: 'delivery' }, // intraday / delivery
    orderType: { type: String, enum: ['buy', 'sell'], required: true },
    orderStatus: { type: String, enum: ['filled', 'cancelled', 'pending', 'partial'], default: 'filled' }
}, { timestamps: true });

module.exports = mongoose.model('orders', orderSchema);
