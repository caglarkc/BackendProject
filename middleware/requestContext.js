// middleware/requestContext.js
const { AsyncLocalStorage } = require('async_hooks');
const asyncLocalStorage = new AsyncLocalStorage();

const requestContextMiddleware = (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const context = { ip };
    
    asyncLocalStorage.run(context, () => {
        next();
    });
};

const getRequestContext = () => {
    return asyncLocalStorage.getStore();
};

module.exports = {
    requestContextMiddleware,
    getRequestContext
};