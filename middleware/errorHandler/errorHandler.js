const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    const response = {
        success: false,
        status: err.statusCode,
        message: err.message,
        errors: err.errors,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        timestamp: new Date().toISOString()
    };

    // Validation hatalarını işle
    if (err.name === 'ValidationError') {
        response.status = 400;
    }

    // MongoDB duplicate key hatalarını işle
    if (err.code === 11000) {
        response.status = 400;
        response.message = 'Bu kayıt zaten mevcut.';
    }

    res.status(response.status).json(response);
};

module.exports = errorHandler; 