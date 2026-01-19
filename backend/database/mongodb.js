const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.mongo_uri;

const dbconnect = async () => {
  try {
    await mongoose.connect(url);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
  }
};

module.exports = dbconnect;