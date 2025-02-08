const Log = require('../models/Log');
const { NOW } = require('../utils/constants/time');
const { getRequestContext } = require('../middleware/requestContext');
const BaseService = require('./BaseService');

class LogService extends BaseService { 
    async createLog(objectId, objectType, actionType) {
        const context = getRequestContext();
        const log = new Log({ objectId, objectType, actionType, ipAddress: context.ip, createdAt: NOW() });
        await log.save();
        return log;
    };

    async createLogWithDetails(objectId, objectType, actionType, details) {
        const context = getRequestContext();
        const log = new Log({ objectId, objectType, actionType, details, ipAddress: context.ip, createdAt: NOW() });
        await log.save();
        return log;
    };

    async getAllLogs() {
        const logs = await Log.find().populate('objectId', 'objectType', 'actionType', 'ipAddress', 'createdAt');
        await this.createLog(null, 'System', 'GET_ALL_LOGS');
        return logs;
    };

    async getAllLogsByUserId(userId) {
        const logs =  await Log.find({ objectId: userId })
            .populate('objectId', 'objectType', 'actionType', 'ipAddress', 'createdAt');
        await this.createLog(userId, 'User', 'GET_USER_LOGS');
        return logs;
    }
}

module.exports = new LogService();

