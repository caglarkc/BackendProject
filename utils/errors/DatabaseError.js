const AppError = require('./AppError');

class DatabaseError extends AppError {
    constructor(message) {
        super(message, 500);
        this.name = 'DatabaseError';
    }
}

module.exports = DatabaseError; 