const express = require('express');
const router = express.Router();
const authController = require('../controllers/authenticationController');

// Ana sayfa - GET
router.get('/', (req, res) => {
    res.json({
        message: 'Authentication API çalışıyor',
        endpoints: {
            register: {
                post: {
                    url: '/register',
                    body: {
                        "name": "Ali",
                        "surname": "Koçer",
                        "email": "ali@example.com",
                        "phone": "5521234567",
                        "password": "Pass123",
                        "confirmPassword": "Pass123"
                    },
                    description: "Yeni kullanıcı kaydı oluşturur"
                }
            },
            login: {
                post: {
                    url: '/login',
                    body: {
                        "data": "ali@example.com or 5521234567", // veya "5521234567"
                        "password": "Pass123"
                    },
                    description: "Email veya telefon numarası ile giriş yapar"
                }
            },
            logout: {
                post: {
                    url: '/logout',
                    body: {
                        "userId": "123456"
                    },
                    description: "Kullanıcı oturumunu kapatır"
                }
            },
            forgotPassword: {
                post: {
                    url: '/forgotPassword',
                    body: {
                        "data": "ali@example.com or 5521234567" // veya "5521234567"
                    },
                    description: "Şifre sıfırlama bağlantısı gönderir"
                }
            }
        }
    });
});

// Authentication routes - hepsi POST
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);

module.exports = router;