const mongoose = require('mongoose');
const errorMessages = require('../config/errorMessages');
const RateLimitError = require('../utils/errors/RateLimitError');
const { NOW, DAY_AGO, WEEK_AGO } = require('../utils/constants/time');
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

ProfileRateLimitSchema.methods.incerementAddAddress = async function() {
    if (this.addAddressCount === 3) {
        throw new RateLimitError(errorMessages.RATE_LIMIT.DAILY_ADDRESS_LIMIT);
    }

    if (this.firstAddAddressAt < DAY_AGO) {
        this.addAddressCount = 1;
        this.firstAddAddressAt = NOW;
        throw new RateLimitError(errorMessages.RATE_LIMIT.DAILY_ADDRESS_LIMIT);
    } else {
        this.addAddressCount += 1;
        return this.save();
    }
    
};

ProfileRateLimitSchema.methods.incrementProfileInfoUpdate = async function() {
    if (this.profileInfoUpdateCount === 3) {
        throw new RateLimitError(errorMessages.RATE_LIMIT.DAILY_PROFILE_INFO_UPDATE_LIMIT);
    }

    if (this.firstProfileInfoUpdateAt < DAY_AGO) {
        this.profileInfoUpdateCount = 1;
        this.firstProfileInfoUpdateAt = NOW;
        throw new RateLimitError(errorMessages.RATE_LIMIT.DAILY_PROFILE_INFO_UPDATE_LIMIT);
    } else {
        this.profileInfoUpdateCount += 1;
        return this.save();
    }
};

ProfileRateLimitSchema.methods.incrementProfileLoginUpdate = async function() {
    if (this.profileLoginUpdateCount === 3) {
        throw new RateLimitError(errorMessages.RATE_LIMIT.DAILY_PROFILE_LOGIN_UPDATE_LIMIT);
    }

    if (this.firstProfileLoginUpdateAt < WEEK_AGO) {
        this.profileLoginUpdateCount = 1;
        this.firstProfileLoginUpdateAt = NOW;
        throw new RateLimitError(errorMessages.RATE_LIMIT.DAILY_PROFILE_LOGIN_UPDATE_LIMIT);
    } else {
        this.profileLoginUpdateCount += 1;
        return this.save();
    }
};

module.exports = mongoose.model('ProfileRateLimit', ProfileRateLimitSchema); 