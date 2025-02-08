const { asyncRedis } = require('../config/redis');
const RedisError = require('../utils/errors/RedisError');

class RedisService {
    async set(key, value, expireTime = 3600) {
        try {
            const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
            await asyncRedis.set(key, stringValue);
            
            if (expireTime) {
                await asyncRedis.expire(key, expireTime);
            }
            
            return true;
        } catch (error) {
            throw new RedisError('Redis veri kaydetme hatası: ' + error.message);
        }
    }

    async get(key) {
        try {
            const value = await asyncRedis.get(key);
            if (!value) return null;

            try {
                return JSON.parse(value);
            } catch {
                return value; // Eğer JSON parse edilemezse string olarak döndür
            }
        } catch (error) {
            throw new RedisError('Redis veri okuma hatası: ' + error.message);
        }
    }

    async delete(key) {
        try {
            await asyncRedis.del(key);
            return true;
        } catch (error) {
            throw new RedisError('Redis veri silme hatası: ' + error.message);
        }
    }

    async exists(key) {
        try {
            const result = await asyncRedis.exists(key);
            return result === 1;
        } catch (error) {
            throw new RedisError('Redis kontrol hatası: ' + error.message);
        }
    }
}

module.exports = new RedisService(); 