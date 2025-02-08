const RateLimitService = require('../services/RateLimitService');
const textUtils = require('../utils/textUtils');

// Genel istek limiti kontrolü
const requestLimitMiddleware = async (req, res, next) => {
    try {
        await RateLimitService.checkAndIncrementIpRequests();
        next();
    } catch (error) {
        next(error);
    }
};

// Kayıt işlemi limiti kontrolü
const registrationLimitMiddleware = async (req, res, next) => {
    try {
        await RateLimitService.checkAndIncrementRegistration();
        next();
    } catch (error) {
        next(error);
    }
};

// Login deneme limiti kontrolü
const loginAttemptLimitMiddleware = async (req, res, next) => {
    try {
        textUtils.validateUserId(userId);
        await RateLimitService.checkAndIncrementLoginAttempts();
        next();
    } catch (error) {
        next(error);
    }
};

// Şifre değiştirme limiti kontrolü
const passwordChangeLimitMiddleware = async (req, res, next) => {
    try {
        await RateLimitService.checkAndIncrementPasswordChange();
        next();
    } catch (error) {
        next(error);
    }
};

// Şifremi unuttum limiti kontrolü
const forgotPasswordLimitMiddleware = async (req, res, next) => {
    try {
        await RateLimitService.checkAndIncrementForgotPassword();
        next();
    } catch (error) {
        next(error);
    }
};

// Adres ekleme limiti kontrolü
const addAddressLimitMiddleware = async (req, res, next) => {
    try {
        await RateLimitService.checkAndIncrementAddAddress();
        next();
    } catch (error) {
        next(error);
    }
};

// Profil bilgi güncelleme limiti kontrolü
const profileInfoUpdateLimitMiddleware = async (req, res, next) => {
    try {
        await RateLimitService.checkAndIncrementProfileInfoUpdate();
        next();
    } catch (error) {
        next(error);
    }
};

// Profil giriş bilgileri güncelleme limiti kontrolü
const profileLoginUpdateLimitMiddleware = async (req, res, next) => {
    try {
        await RateLimitService.checkAndIncrementProfileLoginUpdate();
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

