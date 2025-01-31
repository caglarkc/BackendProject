const mongoose = require('mongoose');
const RateLimitError = require('../utils/errors/RateLimitError');
const errorMessages = require('../config/errorMessages');
const { NOW, HOUR_AGO, WEEK_AGO } = require('../utils/constants/time');


const IpRateLimitSchema = new mongoose.Schema({
    ip: {
        type: String,
        required: true,
        index: true
    },
    requests: {
        count: { type: Number, default: 0 },
        lastReset: { type: Date, default: Date.now }
    },
    registration: {
        count: { type: Number, default: 0 },
        lastReset: { type: Date, default: Date.now }
    },
    // Güvenlik için ek alanlar
    isBlocked: { type: Boolean, default: false },
    blockExpireAt: { type: Date, default: null },
    blockReason: { type: String, default: null },

    // Kayıt limitleri
    firstRegistrationAt: { type: Date, default: null },

}, { timestamps: true });

// Toplam istek sayısını artırmak için method
IpRateLimitSchema.methods.incrementRequests = async function() {
    if (this.totalRequests > 100) {
        throw new RateLimitError(errorMessages.RATE_LIMIT.HOURLY_REQUEST_LIMIT);
    }
    
    // Eğer son sıfırlama 1 saatten önceyse, sayacı sıfırla
    if (this.lastResetAt < HOUR_AGO) {
        this.totalRequests = 1;
        this.lastResetAt = NOW;
        throw new RateLimitError(errorMessages.RATE_LIMIT.HOURLY_REQUEST_LIMIT);
    } else {
        this.totalRequests += 1;
        return this.save();
    }

    
};

// Kayıt limitleri
IpRateLimitSchema.methods.incrementRegistration = async function() {
    if (this.registrationCount === 10) {
        throw new RateLimitError(errorMessages.RATE_LIMIT.WEEKLY_REGISTRATION_LIMIT);
    }

    if (this.firstRegistrationAt < WEEK_AGO) {
        this.registrationCount = 1;
        this.firstRegistrationAt = NOW;
        throw new RateLimitError(errorMessages.RATE_LIMIT.WEEKLY_REGISTRATION_LIMIT);
    } else {
        this.registrationCount += 1;
        return this.save();
    }

};

module.exports = mongoose.model('IpRateLimit', IpRateLimitSchema);
