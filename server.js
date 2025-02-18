const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { requestContextMiddleware } = require('./middleware/requestContext');
const authMiddleware = require('./middleware/authMiddleware');
const tokenBlacklistMiddleware = require('./middleware/tokenBlacklistMiddleware');
const { redisClient } = require('./config/redis');

// Environment variables
dotenv.config();

// Import routes
const authRoute = require('./api/routes/authRoute');
const userRoute = require('./api/routes/userRoute');
const logRoute = require('./api/routes/logRoute');
const adminRoute = require('./api/routes/adminRoute');
    
// Express app
const app = express();

// CORS configuration
app.use(cors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestContextMiddleware);

// Database connections
// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB bağlantısı başarılı'))
    .catch((err) => console.error('MongoDB bağlantı hatası:', err));

// Redis connection
redisClient.on('error', (err) => {
    console.error('Redis Error:', err);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        await redisClient.disconnect();
        console.log('Veritabanı bağlantıları kapatıldı');
        process.exit(0);
    } catch (err) {
        console.error('Kapatma sırasında hata:', err);
        process.exit(1);
    }
});

// Routes
app.use('/api/auth', authRoute);
// Protected routes
app.use('/api/users', [tokenBlacklistMiddleware, authMiddleware], userRoute);
app.use('/api/logs', [tokenBlacklistMiddleware, authMiddleware], logRoute);
app.use('/api/admin', [tokenBlacklistMiddleware, authMiddleware], adminRoute);

// Ana sayfa
app.get('/', (req, res) => {
    console.log('Ana sayfa isteği alındı');
    res.json({
        message: 'API sunucusu çalışıyor',
        version: '1.0.0',
        endpoints: {
            authentication: '/api/auth',
            users: '/api/users',
            logs: '/api/logs',
            admin: '/api/admin'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    
    // ValidationError için 400 status code
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: {
                message: err.message,
                status: 400,
                timestamp: new Date().toISOString()
            }
        });
    }
    
    // Diğer hatalar için
    const statusCode = err.statusCode || err.status || 500;
    res.status(statusCode).json({
        error: {
            message: err.message || 'Internal Server Error',
            status: statusCode,
            timestamp: new Date().toISOString()
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: {
            message: 'Route not found',
            status: 404,
            path: req.originalUrl,
            timestamp: new Date().toISOString()
        }
    });
});

// Server
const PORT = process.env.PORT || 3000;

// Test ortamında değilse server'ı başlat
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

// Export app for testing
module.exports = { app };
