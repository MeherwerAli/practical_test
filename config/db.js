const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from the .env file
dotenv.config({ path: './config/config.env' });

const connectDB = async () => {
  mongoose.set('strictQuery', true);
  const connection = await mongoose.connect(
      process.env.MONGO_URI ? process.env.MONGO_URI : process.env.LOCAL_MONGO_URI,
      {}
  );
  console.log(
      `Mongodb connected: ${connection.connection.host} to db ${connection.connection.name}` .bold.blue
  );
};

module.exports = connectDB;
