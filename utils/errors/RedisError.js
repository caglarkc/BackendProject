const AppError = require('./AppError');

class RedisError extends AppError {
    constructor(message) {
        super(message, 500);
        this.name = 'RedisError';
    }
}

module.exports = RedisError; 