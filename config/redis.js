const Redis = require('redis');
const { promisify } = require('util');
const dotenv = require('dotenv');

// Environment değişkenlerini yükle
dotenv.config();

console.log('Redis Cloud bağlantısı başlatılıyor...');
console.log('Host:', process.env.REDIS_HOST);
console.log('Port:', process.env.REDIS_PORT);
console.log('Username:', process.env.REDIS_USERNAME);

const redisUrl = `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;

// Redis client oluştur
const redisClient = Redis.createClient({
    url: redisUrl,
    socket: {
        reconnectStrategy: function(retries) {
            console.log('Redis bağlantı denemesi:', retries);
            if (retries > 10) {
                return new Error('Maksimum yeniden bağlanma denemesi aşıldı');
            }
            return Math.min(retries * 100, 3000);
        }
    }
});

// Promise tabanlı metodlar
const asyncRedis = {
    get: promisify(redisClient.get).bind(redisClient),
    set: promisify(redisClient.set).bind(redisClient),
    del: promisify(redisClient.del).bind(redisClient),
    exists: promisify(redisClient.exists).bind(redisClient),
    expire: promisify(redisClient.expire).bind(redisClient)
};

// Event listeners
redisClient.on('connect', () => {
    console.log('Redis Cloud bağlantısı başarılı');
});

redisClient.on('error', (err) => {
    console.error('Redis Cloud bağlantı hatası:', err);
});

redisClient.on('ready', () => {
    console.log('Redis Cloud kullanıma hazır');
});

redisClient.on('end', () => {
    console.log('Redis Cloud bağlantısı kapandı');
});

// Bağlantıyı başlat
redisClient.connect().catch(console.error);

module.exports = {
    redisClient,
    asyncRedis
}; 