const jwt = require('jsonwebtoken');

const createAccessToken = (userId) => {
    return jwt.sign(
        { userId }, 
        process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    );
};

const createRefreshToken = (userId) => {
    return jwt.sign(
        { userId }, 
        process.env.REFRESH_TOKEN_SECRET, 
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
    );
};

const verifyToken = (token, isRefreshToken = false) => {
    try {
        const secret = isRefreshToken ? process.env.REFRESH_TOKEN_SECRET : process.env.ACCESS_TOKEN_SECRET;
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
};

module.exports = { createAccessToken, createRefreshToken, verifyToken };