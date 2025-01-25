const Log = require('../../models/Log');

// Get all logs
exports.getAllLogs = async (req, res) => {
    try {
        const logs = await Log.find().populate('userId', 'name email phone');
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};