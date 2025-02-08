const mongoose = require('mongoose');

const blacklistedTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 } // TTL index
    },
    reason: {
        type: String,
        enum: ['LOGOUT', 'SECURITY_BREACH', 'PASSWORD_CHANGE'],
        default: 'LOGOUT'
    }
}, { timestamps: true });

// Token'ı blacklist'e eklemeden önce kontrol et
blacklistedTokenSchema.statics.isBlacklisted = async function(token) {
    return await this.exists({ token });
};

module.exports = mongoose.model('BlacklistedToken', blacklistedTokenSchema); 