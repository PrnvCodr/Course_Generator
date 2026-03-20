const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,  // Fail fast if Atlas is unreachable
      socketTimeoutMS: 45000,          // Close idle sockets after 45s
      maxPoolSize: 10,                 // Maintain up to 10 connections
    });
    console.log(`[DB] Connected: ${conn.connection.host}`);

    // Log if the connection is ever lost (helps debug timeout errors)
    mongoose.connection.on('disconnected', () => {
      console.warn('[DB] MongoDB disconnected — Mongoose will auto-reconnect');
    });
    mongoose.connection.on('reconnected', () => {
      console.log('[DB] MongoDB reconnected');
    });
  } catch (error) {
    console.error(`[DB] Connection error: ${error.message}`);
    console.warn('[DB] Running without database connection');
  }
};

module.exports = connectDB;
