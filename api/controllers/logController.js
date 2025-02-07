const LogService = require('../../services/LogService');
const BaseController = require('./BaseController');


class LogController extends BaseController {
// Get all logs
    async getAllLogs(req, res, next) {
        try {
            const logs = await LogService.getAllLogs();
            res.json(logs);
        } catch (error) {
            next(error);
        }
    };

    async createLog(req, res, next) {
        try {
            const log = await LogService.createLog(req.body);
            res.json(log);
        } catch (error) {
            next(error);
        }
    }

    async getAllLogsByUserId(req, res, next) {
        try {
            const logs = await LogService.getAllLogsByUserId(req.params.userId);
            res.json(logs);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new LogController();