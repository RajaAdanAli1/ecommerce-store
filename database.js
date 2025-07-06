const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection function
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      directConnection: false,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      family: 4, // Use IPv4
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected from MongoDB');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (error) {
        console.error('Error closing MongoDB connection:', error);
        process.exit(1);
      }
    });

    return conn;
  } catch (error) {
    console.error('Database connection error:', error);
    console.error('Error details:', error.message);
    if (error.code === 'ETIMEDOUT' || error.message.includes('IP')) {
      console.error('🚨 IP WHITELIST ISSUE: Make sure your current IP is whitelisted in MongoDB Atlas');
      console.error('💡 Solution: Go to MongoDB Atlas → Network Access → Add IP Address → Add Current IP');
    }
    process.exit(1);
  }
};

// Function to check database connection
const checkConnection = () => {
  const state = mongoose.connection.readyState;
  switch (state) {
    case 0:
      return 'Disconnected';
    case 1:
      return 'Connected';
    case 2:
      return 'Connecting';
    case 3:
      return 'Disconnecting';
    default:
      return 'Unknown';
  }
};

// Function to close database connection
const closeConnection = async () => {
  try {
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
};

// Function to clear database (for testing/development)
const clearDatabase = async () => {
  try {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
    console.log('Database cleared successfully');
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  }
};

// Database health check
const healthCheck = async () => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    if (!isConnected) {
      throw new Error('Database not connected');
    }
    
    // Try to perform a simple operation
    await mongoose.connection.db.admin().ping();
    
    return {
      status: 'healthy',
      connection: checkConnection(),
      database: mongoose.connection.name,
      host: mongoose.connection.host,
      port: mongoose.connection.port
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      connection: checkConnection()
    };
  }
};

module.exports = {
  connectDB,
  checkConnection,
  closeConnection,
  clearDatabase,
  healthCheck
};