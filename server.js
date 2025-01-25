const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Environment variables
dotenv.config();

// Import routes
const authenticationRoute = require('./api/routes/authenticationRoute');
const userRoute = require('./api/routes/userRoute');
const logRoute = require('./api/routes/logRoute');
const adminRoute = require('./api/routes/adminRoute');

// Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB bağlantısı başarılı'))
.catch((err) => console.error('MongoDB bağlantı hatası:', err));

// Routes
app.use('/api/auth', authenticationRoute);
app.use('/api/users', userRoute);
app.use('/api/logs', logRoute);
app.use('/api/admin', adminRoute);

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
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal Server Error',
            status: err.status || 500,
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
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
