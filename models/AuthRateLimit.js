const mongoose = require('mongoose');
const { createLog } = require('../services/LogService');
const { RateLimitError } = require('../utils/errors/RateLimitError');
const { errorMessages } = require('../config/errorMessages');
const { NOW, WEEK_AGO, HOUR_AGO } = require('../utils/constants/time');
const { getRequestContext } = require('../middleware/requestContext');

const AuthRateLimitSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    
    // Login attempt limitleri
    loginAttempts: { type: Number, default: 0 },
    firstLoginAttemptAt: { type: Date, default: null },
    failedAttemptDates: [Date],
    lockUntil: Date,
    isLocked: { type: Boolean, default: false },
    
    // Şifre değiştirme limitleri
    passwordChange: {
        count: { type: Number, default: 0 },
        firstChangeAt: { type: Date, default: null }
    },

    // Şifremi unuttum limitleri
    forgotPassword: {
        count: { type: Number, default: 0 },
        firstRequestAt: { type: Date, default: null }
    }
}, { timestamps: true });

// Login deneme sayısını artırır
AuthRateLimitSchema.methods.incrementLoginAttempts = async function() {
    const context = getRequestContext();
    const userId = context.userId;

    // İlk deneme ise zamanı kaydet
    if (this.loginAttempts === 0) {
        this.firstLoginAttemptAt = NOW();
    }

    // Zaman kontrolü (1 saat geçtiyse sıfırla)
    if (this.firstLoginAttemptAt && this.firstLoginAttemptAt < HOUR_AGO) {
        this.loginAttempts = 1;
        this.firstLoginAttemptAt = NOW();
        this.failedAttemptDates = [NOW()];
        this.isLocked = false;
        await this.save();
        return;
    }

    // Limit kontrolü (3 başarısız deneme)
    if (this.loginAttempts >= 2) {
        this.failedAttemptDates.push(NOW());
        this.loginAttempts = 3;
        this.isLocked = true;
        this.lockUntil = new Date(Date.now() + 60 * 60 * 1000); // 1 saat
        await createLog(userId, 'User', 'LOGIN_ATTEMPT_LIMIT_EXCEEDED');
        await this.save();
        throw new RateLimitError(errorMessages.RATE_LIMIT.LOGIN_ATTEMPT_LIMIT);
    }

    // Sayacı artır
    this.failedAttemptDates.push(NOW());
    this.loginAttempts += 1;
    await this.save();
};

// Şifre değiştirme sayısını artırır
AuthRateLimitSchema.methods.incrementPasswordChange = async function() {
    const context = getRequestContext();
    const userId = context.userId;

    // Zaman kontrolü
    if (this.passwordChange.firstChangeAt && this.passwordChange.firstChangeAt < WEEK_AGO) {
        this.passwordChange.count = 1;
        this.passwordChange.firstChangeAt = NOW();
        await this.save();
        return;
    }

    // İlk değişiklik ise zamanı kaydet
    if (this.passwordChange.count === 0) {
        this.passwordChange.firstChangeAt = NOW();
    }

    // Limit kontrolü (haftalık 3 değişiklik)
    if (this.passwordChange.count >= 3) {
        await createLog(userId, 'User', 'WEEKLY_PASSWORD_CHANGE_LIMIT_EXCEEDED');
        throw new RateLimitError(errorMessages.RATE_LIMIT.WEEKLY_PASSWORD_CHANGE_LIMIT);
    }

    // Sayacı artır
    this.passwordChange.count += 1;
    await this.save();
};

// Şifremi unuttum sayısını artırır
AuthRateLimitSchema.methods.incrementForgotPassword = async function() {
    const context = getRequestContext();
    const userId = context.userId;

    // Zaman kontrolü
    if (this.forgotPassword.firstRequestAt && this.forgotPassword.firstRequestAt < WEEK_AGO) {
        this.forgotPassword.count = 1;
        this.forgotPassword.firstRequestAt = NOW();
        await this.save();
        return;
    }

    // İlk istek ise zamanı kaydet
    if (this.forgotPassword.count === 0) {
        this.forgotPassword.firstRequestAt = NOW();
    }

    // Limit kontrolü (haftalık 3 istek)
    if (this.forgotPassword.count >= 3) {
        await createLog(userId, 'User', 'WEEKLY_FORGOT_PASSWORD_LIMIT_EXCEEDED');
        throw new RateLimitError(errorMessages.RATE_LIMIT.WEEKLY_FORGOT_PASSWORD_LIMIT);
    }

    // Sayacı artır
    this.forgotPassword.count += 1;
    await this.save();
};

module.exports = mongoose.model('AuthRateLimit', AuthRateLimitSchema); 