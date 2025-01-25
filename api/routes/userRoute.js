const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const addressController = require('../controllers/addressController');
// Ana sayfa - GET
router.get('/', (req, res) => {
    res.json({
        message: 'User API çalışıyor',
        endpoints: {
            changePassword: {
                post: {
                    url: '/changePassword',
                    body: {
                        "userId": "123456",
                        "currentPassword": "oldPass123",
                        "newPassword": "newPass123"
                    }
                }
            },
            changeEmail: {
                post: {
                    url: '/changeEmail',
                    body: {
                        "userId": "123456",
                        "password": "pass123",
                        "newEmail": "new@email.com"
                    }
                }
            },
            changePhone: {
                post: {
                    url: '/changePhone',
                    body: {
                        "userId": "123456",
                        "password": "pass123",
                        "newPhone": "5321234567"
                    }
                }
            },
            changeName: {
                post: {
                    url: '/changeName',
                    body: {
                        "userId": "123456",
                        "password": "pass123",
                        "name": "Yeni",
                        "surname": "İsim"
                    }
                }
            },
            addUserAddress: {
                post: {
                    url: '/addUserAddress',
                }
            },
            updateUserAddress: {
                post: {
                    url: '/updateUserAddress',
                }
            },
            setUserDefaultAddress: {
                post: {
                    url: '/setUserDefaultAddress',
                }
            },
            getUserDefaultAddress: {
                post: {
                    url: '/getUserDefaultAddress',
                }
            },
            deleteUserAddress: {
                post: {
                    url: '/deleteUserAddress',
                }
            },
            getAllUserAddresses: {
                post: {
                    url: '/getAllUserAddresses',
                }
            },
            getProfile: {
                post: {
                    url: '/getProfile',
                }
            },
            deleteProfile: {
                post: {
                    url: '/deleteProfile',
                }
            },
        }
    });
});


// Kullanıcı bilgileri güncelleme - hepsi POST
router.post('/changePassword', userController.changePassword);
router.post('/changeEmail', userController.changeEmail);
router.post('/changePhone', userController.changePhone);
router.post('/changeName', userController.changeName);
router.post('/getProfile', userController.getProfile);
router.post('/deleteProfile', userController.deleteProfile);

router.post('/addUserAddress', addressController.addUserAddress);
router.post('/updateUserAddress', addressController.updateUserAddress);
router.post('/setUserDefaultAddress', addressController.setUserDefaultAddress);
router.post('/deleteUserAddress', addressController.deleteUserAddress);
router.post('/getAllUserAddresses', addressController.getAllUserAddresses);
router.post('/getUserDefaultAddress', addressController.getUserDefaultAddress);

module.exports = router;