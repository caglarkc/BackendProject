// utils/errors/ValidationError.js
const AppError = require('./AppError');

class ValidationError extends AppError {
    constructor(message, details = null) {
        super(message, 400, details);
        this.name = 'ValidationError';
    }
}

module.exports = ValidationError;