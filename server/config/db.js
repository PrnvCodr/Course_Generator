const mongoose = require('mongoose');

// Disable buffering globally — operations fail immediately if disconnected
// instead of silently queuing until the 10s timeout
mongoose.set('bufferCommands', false);

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  while (true) {
    try {
      await mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        autoIndex: false,
      });
      console.log(`[DB] Connected: ${mongoose.connection.host}`);

      mongoose.connection.on('disconnected', () => {
        console.warn('[DB] MongoDB disconnected — retrying in 5s...');
        setTimeout(connectDB, 5000);
      });

      break; // Connected successfully — exit the retry loop
    } catch (error) {
      console.error(`[DB] Connection failed: ${error.message} — retrying in 5s...`);
      await new Promise(res => setTimeout(res, 5000));
    }
  }
};

module.exports = connectDB;

