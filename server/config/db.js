const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = async () => {
  try {
    // Try connecting to local MongoDB first
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.warn('Local MongoDB not available. Starting in-memory MongoDB for development...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create({
        instance: { launchTimeout: 60000 }
      });
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log('MongoDB In-Memory Server Connected at', uri);
    } catch (memError) {
      console.error('Failed to start in-memory MongoDB:', memError.message);
      console.error('Please install MongoDB locally or provide a valid MONGO_URI in .env');
      process.exit(1);
    }
  }
};

module.exports = connectDB;
