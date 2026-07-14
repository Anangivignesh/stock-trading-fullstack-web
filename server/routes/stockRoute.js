const express = require('express');
const router = express.Router();
const { getStocks, addStock } = require('../controllers/stockController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/', getStocks);
router.post('/', protect, authorizeRoles('admin'), addStock);

module.exports = router;
