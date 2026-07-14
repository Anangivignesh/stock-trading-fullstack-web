const express = require('express');
const router = express.Router();
const { getOrders, createOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getOrders);
router.post('/', protect, createOrder);

module.exports = router;
