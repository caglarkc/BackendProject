const { 
    createAccessToken, 
    createRefreshToken, 
    verifyToken,
    shouldRefreshToken 
} = require('../utils/tokenUtils');
const BlacklistedToken = require('../models/BlacklistedToken');
const AuthError = require('../utils/errors/AuthError');
const errorMessages = require('../config/errorMessages');

class TokenService {
    async verifyAndDecodeToken(token, isRefreshToken = false) {
        try {
            // Blacklist kontrolü
            if (await BlacklistedToken.isBlacklisted(token)) {
                throw new AuthError(errorMessages.AUTH.TOKEN_BLACKLISTED);
            }

            // Token'ı doğrula
            const decoded = verifyToken(token, isRefreshToken);

            // Otomatik yenileme kontrolü
            if (!isRefreshToken && shouldRefreshToken(token)) {
                const newAccessToken = createAccessToken(decoded.userId);
                return {
                    decoded,
                    newAccessToken
                };
            }

            return { decoded };
        } catch (error) {
            if (error.isExpired) {
                throw new AuthError(errorMessages.AUTH.TOKEN_EXPIRED);
            }
            throw error;
        }
    }

    async blacklistToken(token, userId, reason = 'LOGOUT') {
        const decoded = verifyToken(token);
        const expiresAt = new Date(decoded.exp * 1000);

        await BlacklistedToken.create({
            token,
            userId,
            expiresAt,
            reason
        });
    }

    createTokenPair(userId) {
        return {
            accessToken: createAccessToken(userId),
            refreshToken: createRefreshToken(userId)
        };
    }
}

module.exports = new TokenService(); 