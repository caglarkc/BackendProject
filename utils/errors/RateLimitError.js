const AppError = require('./AppError');

class RateLimitError extends AppError {
    constructor(message, params = {}) {
        super(message, 429);
        this.name = 'RateLimitError';
        this.params = params;
    }
}

module.exports = RateLimitError; 