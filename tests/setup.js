// Test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key';
process.env.PORT = 3001; // Test için farklı port
process.env.MONGODB_URI = 'mongodb://localhost:27017/test-db';

const mongoose = require('mongoose');
const User = require('../models/User');
const BlacklistedToken = require('../models/BlacklistedToken');

// Test database bağlantısı
beforeAll(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Test database bağlantısı başarılı');
    } catch (error) {
        console.error('Test database bağlantı hatası:', error);
        throw error;
    }
});

// Her test öncesi veritabanını temizle
beforeEach(async () => {
    if (mongoose.connection.readyState === 1) {
        await Promise.all([
            User.deleteMany({}),
            BlacklistedToken.deleteMany({})
        ]);
    }
});

// Test sonrası temizlik
afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
        await Promise.all([
            User.deleteMany({}),
            BlacklistedToken.deleteMany({})
        ]);
        await mongoose.connection.close();
        console.log('Test database bağlantısı kapatıldı');
    }
}); 