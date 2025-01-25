const AppError = require('./AppError');

class ValidationError extends AppError {
    constructor(message, errors = []) {
        super(message, 400);
        this.name = 'ValidationError';
        this.errors = errors;
    }
}

module.exports = ValidationError; 