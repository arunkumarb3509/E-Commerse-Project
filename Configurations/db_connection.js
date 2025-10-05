// const {Pool}=require('pg');

// const pool=new Pool({
//    user:"postgres",
//    host:"localhost",
//    database:"E-Commerce",
//    password:"password",
//    Port:5432,
//    // max: 20, 
//    // idleTimeoutMillis: 30000, 
//    // connectionTimeoutMillis: 2000,
// });

// module.exports=pool;


// config/db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Load .env variables

// const connectDB = async () => {
//   try {    
//     await mongoose.connect('mongodb+srv://arunkumarb3509:rqUkz0kh5RSFpUe6@cluster0.nxxks2x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('MongoDB connected');
//   } catch (error) {
//     console.error('MongoDB connection error:', error);
//     process.exit(1); // Exit on failure
//   }
// };

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};
module.exports = connectDB;