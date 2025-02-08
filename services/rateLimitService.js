const IpRateLimit = require('../models/IpRateLimit');
const AuthRateLimit = require('../models/AuthRateLimit');
const ProfileRateLimit = require('../models/ProfileRateLimit');
const BaseService = require('./BaseService');

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
            const ipLimit = await this._findOrCreateLimit(IpRateLimit);
            await ipLimit.incrementRequests();
        } catch (error) {
            throw error;
        }
    }

    async checkAndIncrementRegistration() {
        try {
            const ipLimit = await this._findOrCreateLimit(IpRateLimit);
            await ipLimit.incrementRegistration();
        } catch (error) {
            throw error;
        }
    }

    // Auth Rate Limit İşlemleri
    async checkAndIncrementLoginAttempts() {
        try {
            const authLimit = await this._findOrCreateLimit(AuthRateLimit);
            await authLimit.incrementLoginAttempts();
        } catch (error) {
            throw error;
        }
    }

    async checkAndIncrementPasswordChange() {
        try {
            const authLimit = await this._findOrCreateLimit(AuthRateLimit);
            await authLimit.incrementPasswordChange();
        } catch (error) {
            throw error;
        }
    }

    async checkAndIncrementForgotPassword() {
        try {
            const authLimit = await this._findOrCreateLimit(AuthRateLimit);
            await authLimit.incrementForgotPassword();
        } catch (error) {
            throw error;
        }
    }

    // Profile Rate Limit İşlemleri
    async checkAndIncrementAddAddress() {
        try {
            const profileLimit = await this._findOrCreateLimit(ProfileRateLimit);
            await profileLimit.incerementAddAddress();
        } catch (error) {
            throw error;
        }
    }

    async checkAndIncrementProfileInfoUpdate() {
        try {
            const profileLimit = await this._findOrCreateLimit(ProfileRateLimit);
            await profileLimit.incrementProfileInfoUpdate();
        } catch (error) {
            throw error;
        }
    }

    async checkAndIncrementProfileLoginUpdate() {
        try {
            const profileLimit = await this._findOrCreateLimit(ProfileRateLimit);
            await profileLimit.incrementProfileLoginUpdate();
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new RateLimitService();

