const Log = require('../models/Log');
const { NOW } = require('../utils/constants/time');

exports.createLog = async (objectId, objectType, actionType, ipAddress) => {
    const log = new Log({ objectId, objectType, actionType, ipAddress, createdAt: NOW() });
    await log.save();
};