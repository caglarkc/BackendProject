const mongoose = require('mongoose');
const { createLog } = require('../services/LogService');
const errorMessages = require('../config/errorMessages');
const RateLimitError = require('../utils/errors/RateLimitError');
const { NOW, DAY_AGO, WEEK_AGO } = require('../utils/constants/time');
const { getRequestContext } = require('../middleware/requestContext');

const ProfileRateLimitSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    addAddressCount: { type: Number, default: 0 },
    firstAddAddressAt: Date,

    // Profil bilgi güncelleme limitleri
    profileInfoUpdateCount: { type: Number, default: 0 },
    firstProfileInfoUpdateAt: Date,

    //Profil giriş bilgi güncelleme limitleri
    profileLoginUpdateCount: { type: Number, default: 0 },
    firstProfileLoginUpdateAt: Date,
}, { timestamps: true });

ProfileRateLimitSchema.methods.incrementAddAddress = async function() {
    const context = getRequestContext();
    const userId = context.userId;

    // Önce zaman kontrolü yapılmalı
    if (this.firstAddAddressAt < DAY_AGO) {
        // 24 saat geçmişse sayacı sıfırla
        this.addAddressCount = 1;
        this.firstAddAddressAt = NOW();
        await this.save();
        return;
    }

    // Eğer ilk ekleme ise zamanı kaydet
    if (this.addAddressCount === 0) {
        this.firstAddAddressAt = NOW();
    }

    // Limit kontrolü
    if (this.addAddressCount >= 3) {
        await createLog(userId, 'User', 'DAILY_ADDRESS_LIMIT_EXCEEDED');
        throw new RateLimitError(errorMessages.RATE_LIMIT.DAILY_ADDRESS_LIMIT);
    }

    // Sayacı artır
    this.addAddressCount += 1;
    await this.save();
};

ProfileRateLimitSchema.methods.incrementProfileInfoUpdate = async function() {
    const context = getRequestContext();
    const userId = context.userId;

    // Önce zaman kontrolü yapılmalı
    if (this.firstProfileInfoUpdateAt < DAY_AGO) {
        // 24 saat geçmişse sayacı sıfırla
        this.profileInfoUpdateCount = 1;
        this.firstProfileInfoUpdateAt = NOW();
        await this.save();
        return;
    }

    // Eğer ilk güncelleme ise zamanı kaydet
    if (this.profileInfoUpdateCount === 0) {
        this.firstProfileInfoUpdateAt = NOW();
    }

    // Limit kontrolü
    if (this.profileInfoUpdateCount >= 3) {
        await createLog(userId, 'User', 'DAILY_PROFILE_INFO_UPDATE_LIMIT_EXCEEDED');
        throw new RateLimitError(errorMessages.RATE_LIMIT.DAILY_PROFILE_INFO_UPDATE_LIMIT);
    }

    // Sayacı artır
    this.profileInfoUpdateCount += 1;
    await this.save();
};

ProfileRateLimitSchema.methods.incrementProfileLoginUpdate = async function() {
    const context = getRequestContext();
    const userId = context.userId;

    // Önce zaman kontrolü yapılmalı (bu metod için WEEK_AGO kullanılıyor)
    if (this.firstProfileLoginUpdateAt < WEEK_AGO) {
        // 1 hafta geçmişse sayacı sıfırla
        this.profileLoginUpdateCount = 1;
        this.firstProfileLoginUpdateAt = NOW();
        await this.save();
        return;
    }

    // Eğer ilk güncelleme ise zamanı kaydet
    if (this.profileLoginUpdateCount === 0) {
        this.firstProfileLoginUpdateAt = NOW();
    }

    // Limit kontrolü
    if (this.profileLoginUpdateCount >= 3) {
        await createLog(userId, 'User', 'WEEKLY_PROFILE_LOGIN_UPDATE_LIMIT_EXCEEDED');
        throw new RateLimitError(errorMessages.RATE_LIMIT.DAILY_PROFILE_LOGIN_UPDATE_LIMIT);
    }

    // Sayacı artır
    this.profileLoginUpdateCount += 1;
    await this.save();
};

module.exports = mongoose.model('ProfileRateLimit', ProfileRateLimitSchema); 