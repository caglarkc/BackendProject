const { verifyToken } = require('../utils/tokenUtils');
const AuthError = require('../utils/errors/AuthError');
const User = require('../models/User');
const { getRequestContext } = require('./requestContext');
const TokenService = require('../services/TokenService');
const errorMessages = require('../config/errorMessages');

const authMiddleware = async (req, res, next) => {
    try {
        // Token'ı hem header hem cookie'den kontrol et
        let token = null;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } else if (req.cookies && req.cookies.accessToken) {
            token = req.cookies.accessToken;
        }

        if (!token) {
            throw new AuthError(errorMessages.AUTH.TOKEN_MISSING);
        }

        // Token'ı doğrula ve blacklist kontrolü yap
        const { decoded, newAccessToken } = await TokenService.verifyAndDecodeToken(token);
        
        // Kullanıcıyı bul
        const user = await User.findById(decoded.userId);
        if (!user) {
            throw new AuthError(errorMessages.AUTH.USER_NOT_FOUND);
        }

        // Request context'e kullanıcı bilgilerini kaydet
        const context = getRequestContext();
        context.setUserId(user._id);
        context.setData('userRole', user.role);
        context.setData('userName', user.name);
        context.setData('userEmail', user.email);
        context.setData('userPhone', user.phone);

        // Request objesine kullanıcı bilgilerini ekle
        req.user = user;
        req.userId = user._id;

        // Eğer yeni token oluşturulduysa header'da gönder
        if (newAccessToken) {
            res.setHeader('Authorization', `Bearer ${newAccessToken}`);
        }

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: {
                    message: errorMessages.AUTH.TOKEN_EXPIRED
                }
            });
        }
        
        return res.status(401).json({
            error: {
                message: error.message || errorMessages.AUTH.UNAUTHORIZED
            }
        });
    }
};

module.exports = authMiddleware;