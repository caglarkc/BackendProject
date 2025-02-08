const BlacklistedToken = require('../models/BlacklistedToken');
const AuthError = require('../utils/errors/AuthError');
const errorMessages = require('../config/errorMessages');

const tokenBlacklistMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        
        if (token && await BlacklistedToken.isBlacklisted(token)) {
            throw new AuthError(errorMessages.AUTH.TOKEN_BLACKLISTED);
        }
        
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = tokenBlacklistMiddleware; 