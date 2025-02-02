// utils/errors/AuthError.js
const AppError = require('./AppError');

class AuthError extends AppError {
    constructor(message, details = null) {
        super(message, 401, details);
        this.name = 'AuthError';
    }
}

module.exports = AuthError;