const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const cron = require('node-cron');
const dotenv = require('dotenv');
const connectDB = require('./Configurations/db_connection');

// https://e-commerse-project-foo0.onrender.com

const indexRoutes = require('./Routes/index_route');
const { cleanupExpiredOTPs } = require('./Controllers/Public Controllers/signIn_Controller/cleanupOTP');

dotenv.config(); // Load .env variables

const app = express();
const PORT = process.env.PORT || 5000;

connectDB(); // connect to MongoDB

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000', 'http://localhost:4200', 'https://lovable.dev',
    'https://lovable.dev/projects/639318a6-36f4-4a62-9a94-1d96f3197b8d' ,'http://localhost:50948']
}));

// Routes
app.get('/', (req, res) => {
  res.json({ message: "sample api" });
});


app.use('/api', indexRoutes);

// Scheduled Tasks
cron.schedule('*/5 * * * *', () => {
  cleanupExpiredOTPs();
});

// Server Listen
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
