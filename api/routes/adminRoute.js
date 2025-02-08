const express = require('express');
const router = express.Router();
const AddressController = require('../controllers/AddressController');
const AdminController = require('../controllers/AdminController');

//Ana sayfa
router.get('/' , (req, res) => {
    res.json({
        message: 'Admin API çalışıyor',
        endpoints: {
            getAllAddresses: {
                post: {
                    url: '/getAllAddresses',
                    description: 'Sistemdeki tüm adresleri listeler',
                    response: {
                        "addresses": [
                            {
                                "userId": "123456",
                                "addressName": "Ev Adresim",
                                "name": "Ali",
                                "surname": "Koçer",
                                "phone": "5521234567",
                                "countryCode": "TR",
                                "city": "İstanbul",
                                "district": "Kadıköy",
                                "neighborhood": "Caferağa",
                                "street": "Moda Caddesi",
                                "apartment": "Yıldız Apt",
                                "floor": "3",
                                "door": "7",
                                "postal_code": "34710",
                                "description": "Sarı renkli bina, kapıda market var"
                            }
                        ]
                    }
                }
            },
            getAddressById: {
                post: {
                    url: '/getAddressById',
                    description: 'Belirli bir adresin detaylarını getirir',
                    body: {
                        "addressId": "789012"
                    },
                    response: {
                        "userId": "123456",
                        "addressName": "Ev Adresim",
                        "name": "Ali",
                        "surname": "Koçer",
                        "phone": "5521234567",
                        "countryCode": "TR",
                        "city": "İstanbul",
                        "district": "Kadıköy",
                        "neighborhood": "Caferağa",
                        "street": "Moda Caddesi",
                        "apartment": "Yıldız Apt",
                        "floor": "3",
                        "door": "7",
                        "postal_code": "34710",
                        "description": "Sarı renkli bina, kapıda market var"
                    }
                }
            },
            deleteAddress: {
                post: {
                    url: '/deleteAddress',
                    description: 'Belirli bir adresi sistemden siler',
                    body: {
                        "addressId": "789012"
                    },
                    response: {
                        "message": "Adres başarıyla silindi."
                    }
                }
            },
            getAllUsers: {
                post: {
                    url: '/getAllUsers',
                    description: 'Sistemdeki tüm kullanıcıları listeler',
                    response: {
                        "users": [
                            {
                                "userId": "123456",
                                "name": "Ali",
                                "surname": "Koçer",
                                "email": "ali@example.com",
                                "phone": "5521234567",
                                "role": "user",
                                "isBlocked": false,
                                "defaultAddress": "789012",
                                "addresses": ["789012", "789013"]
                            }
                        ]
                    }
                }
            },
            changeRole: {
                post: {
                    url: '/changeRole',
                    description: 'Kullanıcının rolünü değiştirir',
                    body: {
                        "userId": "123456",
                        "role": "admin"  // Olası değerler: user, admin
                    },
                    response: {
                        "message": "Kullanıcı rolü başarıyla değiştirildi."
                    }
                }
            },
            getUser: {
                post: {
                    url: '/getUser',
                    description: 'Belirli bir kullanıcıyı getirir',
                    body: {
                        "userId": "123456"
                    }
                }
            },
            deleteUser: {
                post: {
                    url: '/deleteUser',
                    description: 'Belirli bir kullanıcıyı sistemden siler',
                    body: {
                        "userId": "123456"
                    }
                }
            }
        }
    });
});

router.post('/getUser', AdminController.getUser);
router.post('/deleteUser', AdminController.deleteUser);
router.post('/getAllUsers', AdminController.getAllUsers);
router.post('/changeRole', AdminController.changeRole);
router.post('/getAllAddresses', AddressController.getAllAddresses);
router.post('/getAddressById', AddressController.getAddressById);
router.post('/deleteAddress', AddressController.deleteAddress);

module.exports = router;