const AppError = require('./AppError');

class AuthError extends AppError {
    constructor(message) {
        super(message, 401);
        this.name = 'AuthenticationError';
    }
}

module.exports = AuthError; 