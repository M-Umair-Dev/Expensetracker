import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';


import expenseRoutes from './routes/expenseRoutes.js';
import userRoutes from './routes/userRoutes.js';


// 1. Setup and Configurations
dotenv.config(); // Loads our secret variables from .env
const app = express();
const PORT = process.env.PORT || 5000;

// 2. Middleware
// This allows our React app to talk to this server and lets our server understand JSON data.
app.use(cors());
app.use(express.json());
app.use('/api/expenses', expenseRoutes);
app.use('/api/users', userRoutes);

// 3. Database Connection
if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI is missing in your .env file!');
  process.exit(1); 
}

mongoose.connect(process.env.MONGO_URI, {
  // This tells Mongoose to ignore the exact thing that is causing your error
  serverSelectionTimeoutMS: 5000, 
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ Failed to connect to MongoDB:', err));

// 4. Basic Route
// This is a test endpoint just to make sure the server works
app.get('/', (req, res) => {
  res.send('Expense Tracker API is running!');
});

// 5. Start the Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});