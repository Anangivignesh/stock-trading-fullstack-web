const Order = require('../models/orderModel');
const Transaction = require('../models/transactionModel');
const User = require('../models/userModel');
const Portfolio = require('../models/portfolioModel');

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const { symbol, name, price, count, totalPrice, stockType, orderType } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (orderType === 'buy') {
      if (user.virtualBalance < totalPrice) {
        return res.status(400).json({ message: 'Insufficient balance to buy stock' });
      }
      user.virtualBalance -= totalPrice;
    } else if (orderType === 'sell') {
      const holding = await Portfolio.findOne({ user: req.user.id, symbol });
      if (!holding || holding.shares < count) {
        return res.status(400).json({ message: 'Insufficient stock shares to sell' });
      }
      user.virtualBalance += totalPrice;
    } else {
      return res.status(400).json({ message: 'Invalid order type' });
    }

    await user.save();

    const order = await Order.create({
      user: req.user.id,
      symbol,
      name,
      price,
      count,
      totalPrice,
      stockType,
      orderType,
      orderStatus: 'filled'
    });

    await Transaction.create({
      user: req.user.id,
      symbol,
      type: orderType.toUpperCase(),
      shares: count,
      price,
      totalPrice,
      paymentMode: 'virtual_balance'
    });

    if (orderType === 'buy') {
      let holding = await Portfolio.findOne({ user: req.user.id, symbol });
      if (holding) {
        holding.shares += count;
        holding.totalPrice += totalPrice;
        holding.avgCost = holding.totalPrice / holding.shares;
        await holding.save();
      } else {
        await Portfolio.create({
          user: req.user.id,
          symbol,
          name: name || symbol,
          shares: count,
          avgCost: price,
          totalPrice
        });
      }
    } else if (orderType === 'sell') {
      let holding = await Portfolio.findOne({ user: req.user.id, symbol });
      if (holding) {
        holding.shares -= count;
        holding.totalPrice -= (holding.avgCost * count);
        if (holding.shares <= 0) {
          await Portfolio.deleteOne({ _id: holding._id });
        } else {
          await holding.save();
        }
      }
    }

    res.status(201).json({ order, balance: user.virtualBalance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getOrders, createOrder };
