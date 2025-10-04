const mongoose = require('mongoose');
require('dotenv').config();

async function connectDB() {
  try {
    // Pick Atlas first, fallback to local
    const uri = process.env.MONGODBATLAS_URI || process.env.MONGODB_URI;

    if (!uri) {
      throw new Error("❌ No MongoDB URI found in .env file");
    }

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // Stop app if DB fails
  }
}

module.exports = { connectDB, mongoose };
