const Watchlist = require('../models/watchlistModel');

const getWatchlist = async (req, res) => {
  try {
    let watchlist = await Watchlist.findOne({ user: req.user.id });
    if (!watchlist) {
      watchlist = await Watchlist.create({ user: req.user.id, stocks: [] });
    }
    res.json(watchlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addToWatchlist = async (req, res) => {
  try {
    const { symbol } = req.body;
    let watchlist = await Watchlist.findOne({ user: req.user.id });
    if (!watchlist) {
      watchlist = await Watchlist.create({ user: req.user.id, stocks: [symbol] });
    } else {
      if (!watchlist.stocks.includes(symbol)) {
        watchlist.stocks.push(symbol);
        await watchlist.save();
      }
    }
    res.status(200).json(watchlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeFromWatchlist = async (req, res) => {
  try {
    const { symbol } = req.params;
    let watchlist = await Watchlist.findOne({ user: req.user.id });
    if (watchlist) {
      watchlist.stocks = watchlist.stocks.filter(s => s !== symbol);
      await watchlist.save();
    }
    res.status(200).json(watchlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getWatchlist, addToWatchlist, removeFromWatchlist };
