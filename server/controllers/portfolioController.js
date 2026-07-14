const Portfolio = require('../models/portfolioModel');
const User = require('../models/userModel');

const getPortfolio = async (req, res) => {
  try {
    const holdings = await Portfolio.find({ user: req.user.id });
    const user = await User.findById(req.user.id).select('virtualBalance');
    res.json({
      holdings,
      cashBalance: user ? user.virtualBalance : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPortfolio };
