const Transaction = require('../models/transactionModel');

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTransaction = async (req, res) => {
  try {
    const { symbol, type, shares, price, totalPrice, paymentMode } = req.body;
    const transaction = await Transaction.create({
      user: req.user.id,
      symbol,
      type,
      shares,
      price,
      totalPrice,
      paymentMode
    });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTransactions, createTransaction };
