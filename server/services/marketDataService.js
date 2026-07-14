const StockListing = require('../models/stockModel');

const initialStocks = [
  { symbol: "AAPL", companyName: "Apple Inc.", sector: "Technology", price: 227.14, change: 2.31, marketCap: "3.45T", volume: "48.2M", exchange: "NASDAQ" },
  { symbol: "MSFT", companyName: "Microsoft Corp.", sector: "Technology", price: 429.82, change: -1.98, marketCap: "3.19T", volume: "22.9M", exchange: "NASDAQ" },
  { symbol: "NVDA", companyName: "NVIDIA Corp.", sector: "Semiconductors", price: 138.44, change: 4.12, marketCap: "3.40T", volume: "210.5M", exchange: "NASDAQ" },
  { symbol: "GOOGL", companyName: "Alphabet Inc.", sector: "Communication", price: 176.29, change: 0.84, marketCap: "2.18T", volume: "18.4M", exchange: "NASDAQ" },
  { symbol: "AMZN", companyName: "Amazon.com Inc.", sector: "Consumer Cyclical", price: 189.71, change: -0.62, marketCap: "1.99T", volume: "31.0M", exchange: "NASDAQ" },
  { symbol: "TSLA", companyName: "Tesla Inc.", sector: "Automotive", price: 248.98, change: 6.42, marketCap: "793.4B", volume: "88.1M", exchange: "NASDAQ" },
  { symbol: "META", companyName: "Meta Platforms", sector: "Communication", price: 512.44, change: -3.11, marketCap: "1.30T", volume: "14.2M", exchange: "NASDAQ" },
  { symbol: "JPM", companyName: "JPMorgan Chase", sector: "Financial Services", price: 214.55, change: 1.09, marketCap: "612.4B", volume: "8.9M", exchange: "NYSE" },
  { symbol: "V", companyName: "Visa Inc.", sector: "Financial Services", price: 278.11, change: 0.44, marketCap: "552.1B", volume: "5.6M", exchange: "NYSE" },
  { symbol: "NFLX", companyName: "Netflix Inc.", sector: "Communication", price: 704.20, change: -8.55, marketCap: "302.5B", volume: "3.4M", exchange: "NASDAQ" },
  { symbol: "AMD", companyName: "Advanced Micro Devices", sector: "Semiconductors", price: 158.33, change: 2.88, marketCap: "256.1B", volume: "42.7M", exchange: "NASDAQ" },
  { symbol: "DIS", companyName: "Walt Disney Co.", sector: "Communication", price: 94.72, change: -0.31, marketCap: "172.9B", volume: "9.8M", exchange: "NYSE" }
];

const seedStocks = async () => {
  try {
    for (const stock of initialStocks) {
      await StockListing.findOneAndUpdate(
        { symbol: stock.symbol },
        stock,
        { upsert: true, new: true }
      );
    }
    console.log('Stock market database seeded.');
  } catch (error) {
    console.error('Error seeding stock listings:', error.message);
  }
};

const simulateMarketUpdates = () => {
  setInterval(async () => {
    try {
      const listings = await StockListing.find();
      for (const listing of listings) {
        const pct = (Math.random() * 3 - 1.5) / 100;
        const priceChange = listing.price * pct;
        listing.price = parseFloat((listing.price + priceChange).toFixed(2));
        listing.change = parseFloat((listing.change + priceChange).toFixed(2));
        await listing.save();
      }
    } catch (err) {
      console.error('Market simulation error:', err.message);
    }
  }, 15000);
};

module.exports = { seedStocks, simulateMarketUpdates };
