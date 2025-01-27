const AppError = require('./AppError');

class ValidationError extends AppError {
    constructor(message, params = {}) {
        // Template değerlerini işle
        const processedMessage = message.replace(/\{(\w+)\}/g, (match, key) => params[key] || match);
        super(processedMessage, 400);
        this.name = 'ValidationError';
        this.params = params;
    }
}

module.exports = ValidationError; 