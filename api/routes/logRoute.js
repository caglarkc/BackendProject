const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');

// Ana sayfa - GET
router.get('/', (req, res) => {
    res.json({
        message: 'Log API çalışıyor',
        endpoints: {
            getAllLogs: {
                post: {
                    url: '/all',
                    description: 'Tüm log kayıtlarını getirir'
                }
            }
        }
    });
});

// Log routes - POST
router.post('/all', logController.getAllLogs);

module.exports = router;