const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const AddressController = require('../controllers/AddressController');
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
router.post('/changePassword', UserController.changePassword);
router.post('/changeEmail', UserController.changeEmail);
router.post('/changePhone', UserController.changePhone);
router.post('/changeName', UserController.changeName);
router.post('/getProfile', UserController.getProfile);
router.post('/deleteProfile', UserController.deleteProfile);

router.post('/addUserAddress', AddressController.addUserAddress);
router.post('/updateUserAddress', AddressController.updateUserAddress);
router.post('/setUserDefaultAddress', AddressController.setUserDefaultAddress);
router.post('/deleteUserAddress', AddressController.deleteUserAddress);
router.post('/getAllUserAddresses', AddressController.getAllUserAddresses);
router.post('/getUserDefaultAddress', AddressController.getUserDefaultAddress);

module.exports = router;