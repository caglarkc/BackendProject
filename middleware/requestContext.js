// middleware/requestContext.js
const { AsyncLocalStorage } = require('async_hooks');
const asyncLocalStorage = new AsyncLocalStorage();

class RequestContext {
    constructor(req) {
        this.ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        this.userId = null;
        this.requestId = Date.now().toString(36) + Math.random().toString(36).substr(2);
        this.timestamp = new Date().toISOString();
        this.method = req.method;
        this.path = req.path;
        this.userAgent = req.get('user-agent');
        this.data = new Map();
    }

    setUserId(userId) {
        this.userId = userId;
    }

    setData(key, value) {
        this.data.set(key, value);
    }

    getData(key) {
        return this.data.get(key);
    }
}

const requestContextMiddleware = (req, res, next) => {
    const context = new RequestContext(req);
    
    // Attach context to request for easy access
    req.context = context;
    
    // Run the middleware with context
    asyncLocalStorage.run(context, () => {
        next();
    });
};

const getRequestContext = () => {
    const context = asyncLocalStorage.getStore();
    if (!context) {
        throw new Error('Request context is not available');
    }
    return context;
};

module.exports = {
    requestContextMiddleware,
    getRequestContext,
    RequestContext
};