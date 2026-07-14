const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler, notFoundHandler } = require('./middleware/errorMiddleware');
const { seedStocks, simulateMarketUpdates } = require('./services/marketDataService');

// Load environment variables
dotenv.config();

// Initialize DB Connection and Seeder
connectDB().then(() => {
  seedStocks();
  simulateMarketUpdates();
});

const app = express();

// Global Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/users', require('./routes/userRoute'));
app.use('/api/stocks', require('./routes/stockRoute'));
app.use('/api/transactions', require('./routes/transactionRoute'));
app.use('/api/orders', require('./routes/orderRoute'));
app.use('/api/portfolio', require('./routes/portfolioRoute'));
app.use('/api/watchlist', require('./routes/watchlistRoute'));
app.use('/api/admin', require('./routes/adminRoute'));

// Root Status Check
app.get('/', (req, res) => {
  res.send('SB Stocks API is running...');
});

// Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
