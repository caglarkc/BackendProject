const IpRateLimit = require('../models/IpRateLimit');
const AuthRateLimit = require('../models/AuthRateLimit');
const ProfileRateLimit = require('../models/ProfileRateLimit');
const Log = require('../models/Log');

class RateLimitService {
    async _findOrCreateLimit(Model, query) {
        let limit = await Model.findOne(query);
        if (!limit) {
            limit = new Model(query);
        }
        return limit;
    }

    async _createLog(objectId, objectType, actionType, ipAddress) {
        try {
            await Log.create({
                objectId,
                objectType,
                actionType,
                ipAddress
            });
        } catch (error) {
            console.error('Log creation failed:', error);
        }
    }

    // IP Rate Limit İşlemleri
    async checkAndIncrementIpRequests(ip) {
        try {
            const ipLimit = await this._findOrCreateLimit(IpRateLimit, { ip });
            await ipLimit.incrementRequests();
            await this._createLog(ipLimit._id, 'IpRateLimit', 'INCREMENT_IP_REQUESTS', ip);
        } catch (error) {
            throw error;
        }
    }

    async checkAndIncrementRegistration(ip) {
        try {
            const ipLimit = await this._findOrCreateLimit(IpRateLimit, { ip });
            await ipLimit.incrementRegistration();
            await this._createLog(ipLimit._id, 'IpRateLimit', 'INCREMENT_REGISTRATION', ip);
        } catch (error) {
            throw error;
        }
    }

    // Auth Rate Limit İşlemleri
    async checkAndIncrementLoginAttempts(userId) {
        try {
            const authLimit = await this._findOrCreateLimit(AuthRateLimit, { userId });
            await authLimit.incrementLoginAttempts();
            const ip = req.ip;
            await this._createLog(userId, 'AuthRateLimit', 'INCREMENT_LOGIN_ATTEMPTS', ip);
        } catch (error) {
            throw error;
        }
    }

    async checkAndIncrementPasswordChange(userId) {
        try {
            const authLimit = await this._findOrCreateLimit(AuthRateLimit, { userId });
            await authLimit.incrementPasswordChange();
            const ip = req.ip;
            await this._createLog(userId, 'AuthRateLimit', 'INCREMENT_PASSWORD_CHANGE', ip);
        } catch (error) {
            throw error;
        }
    }

    async checkAndIncrementForgotPassword(userId) {
        try {
            const authLimit = await this._findOrCreateLimit(AuthRateLimit, { userId });
            await authLimit.incrementForgotPassword();
            const ip = req.ip;
            await this._createLog(userId, 'AuthRateLimit', 'INCREMENT_FORGOT_PASSWORD', ip);
        } catch (error) {
            throw error;
        }
    }

    // Profile Rate Limit İşlemleri
    async checkAndIncrementAddAddress(userId) {
        try {
            const profileLimit = await this._findOrCreateLimit(ProfileRateLimit, { userId });
            await profileLimit.incerementAddAddress();
            const ip = req.ip;
            await this._createLog(userId, 'ProfileRateLimit', 'INCREMENT_ADD_ADDRESS', ip);
        } catch (error) {
            throw error;
        }
    }

    async checkAndIncrementProfileInfoUpdate(userId) {
        try {
            const profileLimit = await this._findOrCreateLimit(ProfileRateLimit, { userId });
            await profileLimit.incrementProfileInfoUpdate();
            const ip = req.ip;
            await this._createLog(userId, 'ProfileRateLimit', 'INCREMENT_PROFILE_INFO_UPDATE', ip);
        } catch (error) {
            throw error;
        }
    }

    async checkAndIncrementProfileLoginUpdate(userId) {
        try {
            const profileLimit = await this._findOrCreateLimit(ProfileRateLimit, { userId });
            await profileLimit.incrementProfileLoginUpdate();
            const ip = req.ip;
            await this._createLog(userId, 'ProfileRateLimit', 'INCREMENT_PROFILE_LOGIN_UPDATE', ip);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new RateLimitService();

