const { verifyToken } = require('../utils/tokenUtils');
const { AuthError } = require('../utils/errors/AuthError');
const User = require('../models/User');
const { getRequestContext } = require('./requestContext');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            throw new AuthError('Token bulunamadı');
        }

        const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET);
        if (!decoded) {
            throw new AuthError('Geçersiz token');
        }

        req.user = await User.findById(decoded.userId);
        
        // Set user information in the request context
        const context = getRequestContext();
        context.setUserId(decoded.userId);
        context.setData('userRole', req.user.role);
        context.setData('userName', req.user.name);
        context.setData('userEmail', req.user.email);
        context.setData('userPhone', req.user.phone);
        
        next();
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

module.exports = authMiddleware;