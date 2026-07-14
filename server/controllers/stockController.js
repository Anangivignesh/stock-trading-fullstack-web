const StockListing = require('../models/stockModel');

const getStocks = async (req, res) => {
  try {
    const stocks = await StockListing.find();
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addStock = async (req, res) => {
  try {
    const { symbol, companyName, exchange, sector, industry, price, change, marketCap, volume } = req.body;
    const stock = await StockListing.create({
      symbol,
      companyName,
      exchange,
      sector,
      industry,
      price,
      change,
      marketCap,
      volume
    });
    res.status(201).json(stock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStocks, addStock };
