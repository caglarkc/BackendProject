const express = require('express');
const connectDB = require('./config/database');
const app = express();

// MongoDB bağlantısı
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Modülleri import et
const farmerRoutes = require('./farmer');


// Ana sayfa
app.get('/', (req, res) => {
    res.json({
        message: 'Ana API sunucusu çalışıyor',
        availableRoutes: {
            farmer: '/farmer',

        }
    });
});

// Modülleri kullan (route'ları birleştir)
app.use('/farmer', farmerRoutes);


// Sunucuyu başlat
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Ana sunucu http://localhost:${PORT} adresinde çalışıyor`);
});
