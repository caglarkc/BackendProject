const { getRequestContext } = require('../middleware/requestContext');


class BaseService {
    async getIp() {
        const context = getRequestContext();
        return context.ip;
    }

    async getUserId() {
        const context = getRequestContext();
        return context.userId;
    }
}

module.exports = BaseService;