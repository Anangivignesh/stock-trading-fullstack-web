const express = require('express');
const router = express.Router();
const { getTransactions, createTransaction } = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getTransactions);
router.post('/', protect, createTransaction);

module.exports = router;
