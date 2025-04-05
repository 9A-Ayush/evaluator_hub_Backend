const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// ✅ Secure CORS setup
const allowedOrigins = [
  'https://evaluator-hub-frnt.vercel.app', // Your deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS 😢'));
    }
  },
  credentials: true
}));

// Simple request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  if (req.method === 'POST') {
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
  }
  next();
});

// API Routes
const userRoutes = require('./routes/userRoutes');
const evaluationRoutes = require('./routes/evaluationRoutes');
const assetRoutes = require('./routes/assetRoutes');
const reportRoutes = require('./routes/reportRoutes');

app.use('/api/users', userRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/reports', reportRoutes);

// 404 for unknown API routes
app.all('/api/*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// Optional: basic root route for testing
app.get('/', (req, res) => {
  res.send('✅ API is live!');
});

// MongoDB Connection
let cachedDb = null;
const connectToMongo = async () => {
  if (cachedDb) return cachedDb;
  const client = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
  });
  cachedDb = client;
  return client;
};

connectToMongo()
  .then(() => console.log('✅ Connected to MongoDB successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Error Handling
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ success: false, message: err.message || 'Internal server error' });
});

process.on('uncaughtException', err => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', err => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

// Start Server
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`🔥 Backend running on port ${PORT}`);
});

module.exports = app;
