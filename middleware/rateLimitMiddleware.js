const rateLimitService = require('../services/rateLimitService');
const textUtils = require('../utils/textUtils');

// Genel istek limiti kontrolü
const requestLimitMiddleware = async (req, res, next) => {
    try {
        const ip = req.ip || req.connection.remoteAddress;
        await rateLimitService.checkAndIncrementIpRequests(ip);
        next();
    } catch (error) {
        next(error);
    }
};

// Kayıt işlemi limiti kontrolü
const registrationLimitMiddleware = async (req, res, next) => {
    try {
        const ip = req.ip || req.connection.remoteAddress;
        await rateLimitService.checkAndIncrementRegistration(ip);
        next();
    } catch (error) {
        next(error);
    }
};

// Login deneme limiti kontrolü
const loginAttemptLimitMiddleware = async (req, res, next) => {
    try {
        const userId = req.userId;
        const ip = req.ip || req.connection.remoteAddress;
        textUtils.validateUserId(userId);
        await rateLimitService.checkAndIncrementLoginAttempts(userId, ip);
        next();
    } catch (error) {
        next(error);
    }
};

// Şifre değiştirme limiti kontrolü
const passwordChangeLimitMiddleware = async (req, res, next) => {
    try {
        const userId = req.userId; // JWT'den gelen kullanıcı ID'si
        const ip = req.ip || req.connection.remoteAddress;
        textUtils.validateUserId(userId);
        await rateLimitService.checkAndIncrementPasswordChange(userId, ip);
        next();
    } catch (error) {
        next(error);
    }
};

// Şifremi unuttum limiti kontrolü
const forgotPasswordLimitMiddleware = async (req, res, next) => {
    try {
        const userId = req.userId;
        const ip = req.ip || req.connection.remoteAddress;
        textUtils.validateUserId(userId);
        await rateLimitService.checkAndIncrementForgotPassword(userId, ip);
        next();
    } catch (error) {
        next(error);
    }
};

// Adres ekleme limiti kontrolü
const addAddressLimitMiddleware = async (req, res, next) => {
    try {
        const userId = req.userId;
        const ip = req.ip || req.connection.remoteAddress;
        textUtils.validateUserId(userId);
        await rateLimitService.checkAndIncrementAddAddress(userId, ip);
        next();
    } catch (error) {
        next(error);
    }
};

// Profil bilgi güncelleme limiti kontrolü
const profileInfoUpdateLimitMiddleware = async (req, res, next) => {
    try {
        const userId = req.userId;
        const ip = req.ip || req.connection.remoteAddress;
        textUtils.validateUserId(userId);
        await rateLimitService.checkAndIncrementProfileInfoUpdate(userId, ip);
        next();
    } catch (error) {
        next(error);
    }
};

// Profil giriş bilgileri güncelleme limiti kontrolü
const profileLoginUpdateLimitMiddleware = async (req, res, next) => {
    try {
        const userId = req.userId;
        const ip = req.ip || req.connection.remoteAddress;
        textUtils.validateUserId(userId);
        await rateLimitService.checkAndIncrementProfileLoginUpdate(userId, ip);
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    requestLimitMiddleware,
    registrationLimitMiddleware,
    loginAttemptLimitMiddleware,
    passwordChangeLimitMiddleware,
    forgotPasswordLimitMiddleware,
    addAddressLimitMiddleware,
    profileInfoUpdateLimitMiddleware,
    profileLoginUpdateLimitMiddleware
};

