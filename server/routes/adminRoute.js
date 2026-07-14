const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Transaction = require('../models/transactionModel');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Get all users (Admin only)
router.get('/users', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get system activity (Admin only)
router.get('/activity', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('user', 'username email');
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
