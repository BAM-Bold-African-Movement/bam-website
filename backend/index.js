require('dotenv').config();
const app = require('./server');
const mongoose = require('mongoose');
const logger = require('./config/logger');
const path = require('path');
const fs = require('fs').promises;

const PORT = process.env.PORT || 5000;

// Ensure required directories exist
const ensureDirectories = async () => {
  const dirs = ['uploads', 'logs'].map(dir => path.join(__dirname, dir));
  
  for (const dir of dirs) {
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
      logger.info(`Created directory: ${dir}`);
    }
  }
};

// Connect to MongoDB with retry logic
const connectDB = async (retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        family: 4
      });
      
      // Test the connection
      await mongoose.connection.db.admin().ping();
      logger.info('MongoDB Connected Successfully');
      return true;
    } catch (err) {
      logger.error('MongoDB connection attempt failed:', {
        error: err.message,
        attempt: i + 1,
        maxRetries: retries
      });
      
      if (i === retries - 1) {
        logger.error('Failed to connect to MongoDB after all retries');
        return false;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, i), 10000)));
    }
  }
  return false;
};

// Initialize the application
const initializeApp = async () => {
  try {
    // Ensure directories exist
    await ensureDirectories();

    // Connect to MongoDB
    const isConnected = await connectDB();
    if (!isConnected) {
      throw new Error('Unable to connect to MongoDB');
    }

    // Start the server
    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });

    // Handle server errors
    server.on('error', (error) => {
      logger.error('Server error:', error);
      process.exit(1);
    });

    return server;
  } catch (error) {
    logger.error('Failed to initialize application:', error);
    throw error;
  }
};

// Graceful shutdown handler
const shutdown = async (server) => {
  try {
    logger.info('Shutting down gracefully...');
    
    if (server) {
      await new Promise((resolve) => {
        server.close(resolve);
      });
      logger.info('Server closed');
    }

    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed');
    }

    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
};

// Start the application
(async () => {
  let server;
  try {
    server = await initializeApp();
    
    // Handle process events
    process.on('SIGTERM', () => shutdown(server));
    process.on('SIGINT', () => shutdown(server));
    
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      shutdown(server);
    });
    
    process.on('unhandledRejection', (error) => {
      logger.error('Unhandled Rejection:', error);
      shutdown(server);
    });
    
  } catch (error) {
    logger.error('Application startup failed:', error);
    await shutdown(server);
  }
})(); 