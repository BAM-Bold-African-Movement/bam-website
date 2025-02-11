require('dotenv').config();
const mongoose = require('mongoose');
const logger = require('../config/logger');

const testConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      family: 4
    });
    
    logger.info('MongoDB connection test successful');
    console.log('Successfully connected to MongoDB');
    
    await mongoose.connection.close();
    logger.info('Connection closed');
    console.log('Connection closed');
    
    process.exit(0);
  } catch (error) {
    logger.error('MongoDB connection test failed:', error);
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
};

testConnection(); 