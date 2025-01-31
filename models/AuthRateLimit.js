const mongoose = require('mongoose');
const { RateLimitError } = require('../utils/errors/RateLimitError');
const { errorMessages } = require('../config/errorMessages');
const { NOW, WEEK_AGO } = require('../utils/constants/time');

const AuthRateLimitSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    
    loginAttempts: { type: Number, default: 0 },
    failedAttemptDates: { type: Array, default: [] },
    lockUntil: Date,
    isLocked: { type: Boolean, default: false },
    
    passwordChangeCount: { type: Number, default: 0 },
    firstPasswordChangeAt: Date,

    forgotPasswordCount: { type: Number, default: 0 },
    firstForgotPasswordAt: Date,
}, { timestamps: true });

//Önceki deneme sayısını artırır
AuthRateLimitSchema.methods.incrementLoginAttempts = async function() {
    if (this.failedAttemptDates.length === 2) {
        this.failedAttemptDates.push(NOW);
        this.loginAttempts = 3;
        this.isLocked = true;
        await this.save();
        throw new RateLimitError(errorMessages.RATE_LIMIT.LOGIN_ATTEMPT_LIMIT);
    }
    
    this.failedAttemptDates.push(NOW);
    this.loginAttempts += 1;
    return this.save();
}



AuthRateLimitSchema.methods.incrementPasswordChange = async function() {
    if (this.passwordChangeCount === 3) {
        throw new RateLimitError(errorMessages.RATE_LIMIT.WEEKLY_PASSWORD_CHANGE_LIMIT);
    }

    if (this.firstPasswordChangeAt < WEEK_AGO) {
        this.passwordChangeCount = 1;
        this.firstPasswordChangeAt = NOW;
        throw new RateLimitError(errorMessages.RATE_LIMIT.WEEKLY_PASSWORD_CHANGE_LIMIT);
    }
    
    this.passwordChangeCount += 1;
    return this.save();
};

AuthRateLimitSchema.methods.incrementForgotPassword = async function() {
    if (this.forgotPasswordCount === 3) {
        throw new RateLimitError(errorMessages.RATE_LIMIT.WEEKLY_FORGOT_PASSWORD_LIMIT);
    }

    if (this.firstForgotPasswordAt < WEEK_AGO) {
        this.forgotPasswordCount = 1;
        this.firstForgotPasswordAt = NOW;
        throw new RateLimitError(errorMessages.RATE_LIMIT.WEEKLY_FORGOT_PASSWORD_LIMIT);
    }
    
    this.forgotPasswordCount += 1;
    return this.save();
};


module.exports = mongoose.model('AuthRateLimit', AuthRateLimitSchema); 