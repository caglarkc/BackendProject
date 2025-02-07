const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

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
            },
            refresh: {
                post: {
                    url: '/refresh',
                    description: "Yeni erişim tokenı alır"
                }
            }
        }
    });
});

// Authentication routes - hepsi POST
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.post('/forgotPassword', AuthController.forgotPassword);
router.post('/refresh', AuthController.refresh);

module.exports = router;