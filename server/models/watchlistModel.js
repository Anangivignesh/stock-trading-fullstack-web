const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true, unique: true },
    stocks: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('watchlists', watchlistSchema);
