const IpRateLimit = require('../models/IpRateLimit');
const AuthRateLimit = require('../models/AuthRateLimit');
const ProfileRateLimit = require('../models/ProfileRateLimit');
const BaseService = require('./BaseService');
const { getRequestContext } = require('../middleware/requestContext');

class RateLimitService extends BaseService {

    async _findOrCreateLimit(Model, query) {
        let limit = await Model.findOne(query);
        if (!limit) {
            limit = new Model(query);
            await limit.save();
        }
        return limit;
    }

    // IP Rate Limit İşlemleri
    async checkAndIncrementIpRequests() {
        try {
            const context = getRequestContext();
            const ip = context.ip;
            const ipLimit = await this._findOrCreateLimit(IpRateLimit, { ip });
            await ipLimit.incrementRequests();
        } catch (error) {
            throw error;
        }
    }

    async checkAndIncrementRegistration() {
        try {
            const context = getRequestContext();
            const ip = context.ip;
            const ipLimit = await this._findOrCreateLimit(IpRateLimit, { ip });
            await ipLimit.incrementRegistration();
        } catch (error) {
            throw error;
        }
    }

    // Auth Rate Limit İşlemleri
    async checkAndIncrementLoginAttempts() {
        try {
            const context = getRequestContext();
            const userId = context.userId;
            const authLimit = await this._findOrCreateLimit(AuthRateLimit, { userId });
            await authLimit.incrementLoginAttempts();
        } catch (error) {
            throw error;
        }
    }

    async checkAndIncrementPasswordChange() {
        try {
            const context = getRequestContext();
            const userId = context.userId;
            const authLimit = await this._findOrCreateLimit(AuthRateLimit, { userId });
            await authLimit.incrementPasswordChange();
        } catch (error) {
            throw error;
        }
    }

    async checkAndIncrementForgotPassword() {
        try {
            const context = getRequestContext();
            const userId = context.userId;
            const authLimit = await this._findOrCreateLimit(AuthRateLimit, { userId });
            await authLimit.incrementForgotPassword();
        } catch (error) {
            throw error;
        }
    }

    // Profile Rate Limit İşlemleri
    async checkAndIncrementAddAddress() {
        try {
            const context = getRequestContext();
            const userId = context.userId;
            const profileLimit = await this._findOrCreateLimit(ProfileRateLimit, { userId });
            await profileLimit.incerementAddAddress();
        } catch (error) {
            throw error;
        }
    }

    async checkAndIncrementProfileInfoUpdate() {
        try {
            const context = getRequestContext();
            const userId = context.userId;
            const profileLimit = await this._findOrCreateLimit(ProfileRateLimit, { userId });
            await profileLimit.incrementProfileInfoUpdate();
        } catch (error) {
            throw error;
        }
    }

    async checkAndIncrementProfileLoginUpdate() {
        try {   
            const context = getRequestContext();
            const userId = context.userId;
            const profileLimit = await this._findOrCreateLimit(ProfileRateLimit, { userId });
            await profileLimit.incrementProfileLoginUpdate();
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new RateLimitService();

