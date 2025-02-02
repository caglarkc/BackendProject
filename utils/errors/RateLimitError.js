// utils/errors/RateLimitError.js
const AppError = require('./AppError');

class RateLimitError extends AppError {
    constructor(message, details = null) {
        super(message, 429, details);
        this.name = 'RateLimitError';
        
        // Rate limit özel bilgileri
        if (details) {
            this.retryAfter = details.retryAfter;
            this.remainingAttempts = details.remainingAttempts;
        }
    }

    toJSON() {
        const baseJson = super.toJSON();
        return {
            ...baseJson,
            retryAfter: this.retryAfter,
            remainingAttempts: this.remainingAttempts
        };
    }
}

module.exports = RateLimitError;