const express = require('express');
const router = express.Router();
const LogController = require('../controllers/LogController');

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
router.post('/all', LogController.getAllLogs);

module.exports = router;