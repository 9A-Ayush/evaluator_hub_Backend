const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({path: path.join(__dirname, '.env')});

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: '*',  // Allow all origins temporarily for testing
    credentials: true
}));

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '..')));

// Add request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    if (req.method === 'POST') {
        console.log('Request headers:', req.headers);
        console.log('Request body:', req.body);
    }
    next();
});

// Routes
const userRoutes = require('./routes/userRoutes');
const evaluationRoutes = require('./routes/evaluationRoutes');
const assetRoutes = require('./routes/assetRoutes');
const reportRoutes = require('./routes/reportRoutes');

app.use('/api/users', userRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/reports', reportRoutes);

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Handle all other routes by serving index.html
app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
        res.status(404).json({ message: 'API endpoint not found' });
    } else {
        res.sendFile(path.join(__dirname, '..', req.path));
    }
});

// Connect to MongoDB
// Serverless-optimized MongoDB connection
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

// Connect to MongoDB
connectToMongo()
    .then(() => console.log('Connected to MongoDB successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Add detailed error logging for uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
});

// Start server
const PORT = process.env.PORT || 5003;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;