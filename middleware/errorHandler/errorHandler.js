// middleware/errorHandler/errorHandler.js
const errorHandler = (err, req, res, next) => {
    // HTTP durum kodları
    const statusCodes = {
        ValidationError: 400,
        AuthError: 401,
        NotFoundError: 404,
        RateLimitError: 429,
        DatabaseError: 500
    };

    const response = {
        success: false,
        status: statusCodes[err.name] || err.statusCode || 500,
        message: err.message,
        details: err.details || null,
        type: err.type || null,
        timestamp: new Date().toISOString()
    };

    // Development ortamında stack trace ekle
    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }

    res.status(response.status).json(response);
};

module.exports = errorHandler; 