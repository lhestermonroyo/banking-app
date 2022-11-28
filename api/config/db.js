require('dotenv').config();
const mongoose = require('mongoose');

const DatabaseError = require('../responses/DatabaseError');

const { MONGO_URI } = process.env;

const connectDB = () => {
  try {
    mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Database connection successful.');
  } catch (error) {
    console.log(new DatabaseError(`Database connection failed: ${error}`));

    process.exit(1);
  }
};

module.exports = connectDB;
