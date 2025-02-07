const mongoose = require('mongoose');
const { createLog } = require('../services/LogService');
const RateLimitError = require('../utils/errors/RateLimitError');
const errorMessages = require('../config/errorMessages');
const { NOW, HOUR_AGO, WEEK_AGO } = require('../utils/constants/time');
const { getRequestContext } = require('../middleware/requestContext');

const IpRateLimitSchema = new mongoose.Schema({
    ip: {
        type: String,
        required: true,
        index: true
    },
    requests: {
        count: { type: Number, default: 0 },
        firstRequestAt: { type: Date, default: null }
    },
    registration: {
        count: { type: Number, default: 0 },
        firstRegistrationAt: { type: Date, default: null }
    },
    // Güvenlik için ek alanlar
    isBlocked: { type: Boolean, default: false },
    blockExpireAt: { type: Date, default: null },
    blockReason: { type: String, default: null }
}, { timestamps: true });

// Toplam istek sayısını artırmak için method
IpRateLimitSchema.methods.incrementRequests = async function() {
    const context = getRequestContext();
    const ip = context.ip;

    // Önce zaman kontrolü yapılmalı
    if (this.requests.firstRequestAt && this.requests.firstRequestAt < HOUR_AGO) {
        // 1 saat geçmişse sayacı sıfırla
        this.requests.count = 1;
        this.requests.firstRequestAt = NOW();
        await this.save();
        return;
    }

    // Eğer ilk istek ise zamanı kaydet
    if (this.requests.count === 0) {
        this.requests.firstRequestAt = NOW();
    }

    // Limit kontrolü (saatlik 100 istek)
    if (this.requests.count >= 100) {
        await createLog(ip, 'IP', 'HOURLY_REQUEST_LIMIT_EXCEEDED');
        throw new RateLimitError(errorMessages.RATE_LIMIT.HOURLY_REQUEST_LIMIT);
    }

    // Sayacı artır
    this.requests.count += 1;
    await this.save();
};

// Kayıt limitleri
IpRateLimitSchema.methods.incrementRegistration = async function() {
    const context = getRequestContext();
    const ip = context.ip;

    // Önce zaman kontrolü yapılmalı
    if (this.registration.firstRegistrationAt && this.registration.firstRegistrationAt < WEEK_AGO) {
        // 1 hafta geçmişse sayacı sıfırla
        this.registration.count = 1;
        this.registration.firstRegistrationAt = NOW();
        await this.save();
        return;
    }

    // Eğer ilk kayıt ise zamanı kaydet
    if (this.registration.count === 0) {
        this.registration.firstRegistrationAt = NOW();
    }

    // Limit kontrolü (haftalık 10 kayıt)
    if (this.registration.count >= 10) {
        await createLog(ip, 'IP', 'WEEKLY_REGISTRATION_LIMIT_EXCEEDED');
        throw new RateLimitError(errorMessages.RATE_LIMIT.WEEKLY_REGISTRATION_LIMIT);
    }

    // Sayacı artır
    this.registration.count += 1;
    await this.save();
};

module.exports = mongoose.model('IpRateLimit', IpRateLimitSchema);
