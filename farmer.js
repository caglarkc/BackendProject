const express = require('express');
const router = express.Router();
const Farmer = require('./models/Farmer');
const mongoose = require('mongoose');

// Ana farmer sayfası
router.get('/', (req, res) => {
    res.json({ 
        message: 'Farmer API çalışıyor',
        endpoints: {
            add: {
                post: {
                    url: '/add',
                    body: { 
                        "name": "John Doe",
                        "location": "İzmir",
                        "email": "john@example.com",
                        "phone": "5321234567"
                    }
                }
            },
            get: {
                all: '/all',
                byId: '/get'
            },
            update: {
                post: {
                    url: '/update',
                    body: {
                        "farmerId": "123456",
                        "name": "John Doe",
                        "location": "İzmir",
                        "email": "john@example.com",
                        "phone": "5321234567"
                    }
                }
            },
            delete: {
                post: {
                    url: '/delete',
                    body: {
                        "farmerId": "123456"
                    }
                }
            }
        }
    });
});

// Tüm çiftçileri getir
router.post('/all', async (req, res) => {
    try {
        const farmers = await Farmer.find();
        if (!farmers.length) {
            return res.status(404).json({ error: "Hiç çiftçi bulunamadı." });
        }
        res.json(farmers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ID ile çiftçi getir
router.post('/get', async (req, res) => {
    try {
        const farmer = await Farmer.findById(req.body.farmerId);
        if (!farmer) {
            return res.status(404).json({ error: "Çiftçi bulunamadı." });
        }
        res.json(farmer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Çiftçi ekle
router.post('/add', async (req, res) => {
    try {
        const {email, phone } = req.body;

        // Aynı email başka bir çiftçi tarafından kullanılıyor mu?
        const existingEmail = await Farmer.findOne({ email: email, _id: { $ne: farmerId } });
        if (existingEmail) {
            return res.status(400).json({ error: "Bu email adresi başka bir çiftçi tarafından kullanılıyor." });
        }

        // Aynı telefon numarası başka bir çiftçi tarafından kullanılıyor mu?
        const existingPhone = await Farmer.findOne({ phone: phone, _id: { $ne: farmerId } });
        if (existingPhone) {
            return res.status(400).json({ error: "Bu telefon numarası başka bir çiftçi tarafından kullanılıyor." });
        }
        const farmer = new Farmer(req.body);
        await farmer.save();
        res.status(201).json(farmer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Çiftçi güncelle
router.post('/update', async (req, res) => {
    try {
        const { farmerId, email, phone, name, ...updateData } = req.body;

        // farmerId'nin geçerli bir ObjectId olup olmadığını kontrol et
        if (!mongoose.Types.ObjectId.isValid(farmerId)) {
            return res.status(400).json({ error: "Geçerli bir farmerId giriniz." });
        }

        // Aynı email başka bir çiftçi tarafından kullanılıyor mu?
        const existingEmail = await Farmer.findOne({ email: email, _id: { $ne: farmerId } });
        if (existingEmail) {
            return res.status(400).json({ error: "Bu email adresi başka bir çiftçi tarafından kullanılıyor." });
        }

        // Aynı telefon numarası başka bir çiftçi tarafından kullanılıyor mu?
        const existingPhone = await Farmer.findOne({ phone: phone, _id: { $ne: farmerId } });
        if (existingPhone) {
            return res.status(400).json({ error: "Bu telefon numarası başka bir çiftçi tarafından kullanılıyor." });
        }


        const farmer = await Farmer.findByIdAndUpdate(
            farmerId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!farmer) {
            return res.status(404).json({ error: "Çiftçi bulunamadı." });
        }

        res.json(farmer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// Çiftçi sil
router.post('/delete', async (req, res) => {
    try {
        const farmer = await Farmer.findByIdAndDelete(req.body.farmerId);
        if (!farmer) {
            return res.status(404).json({ error: "Çiftçi bulunamadı." });
        }
        res.json({ message: "Çiftçi başarıyla silindi.", deletedFarmer: farmer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
