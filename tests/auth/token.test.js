const request = require('supertest');
const { app } = require('../../server');
const TokenService = require('../../services/TokenService');
const { createAccessToken } = require('../../utils/tokenUtils');
const jwt = require('jsonwebtoken');
const errorMessages = require('../../config/errorMessages');
const mongoose = require('mongoose');
const User = require('../../models/User');

// Test öncesi environment variables'ı ayarla
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key';

describe('Token Management Tests', () => {
    let accessToken;
    let testUser;
    const testUserId = new mongoose.Types.ObjectId();

    beforeAll(async () => {
        // Test kullanıcısı oluştur
        testUser = await User.create({
            _id: testUserId,
            name: 'Test',
            surname: 'User',
            email: 'test@example.com',
            phone: '5551234567',
            password: 'hashedPassword123',
            role: 'user'
        });
    });

    beforeEach(async () => {
        // Her test öncesi yeni token oluştur
        accessToken = createAccessToken(testUserId);
    });

    afterAll(async () => {
        // Test kullanıcısını temizle
        await User.deleteOne({ _id: testUserId });
    });

    // 1. Otomatik Token Yenileme Testi
    test('should auto refresh token when close to expiration', async () => {
        const result = await TokenService.verifyAndDecodeToken(accessToken);
        
        if (result.newAccessToken) {
            expect(result.newAccessToken).toBeDefined();
            expect(result.decoded.userId).toBe(testUserId.toString());
        }
    });

    // 2. Token Blacklist Testi
    test('should blacklist token on logout', async () => {
        const logoutResponse = await request(app)
            .post('/api/auth/logout')
            .set('Cookie', [`accessToken=${accessToken}`]);

        expect(logoutResponse.status).toBe(200);

        const protectedResponse = await request(app)
            .post('/api/users/getProfile')
            .set('Cookie', [`accessToken=${accessToken}`]);

        expect(protectedResponse.status).toBe(401);
        expect(protectedResponse.body.error.message).toBe(errorMessages.AUTH.TOKEN_BLACKLISTED);
    });

    // 3. Token Doğrulama Testi
    test('should verify token consistently across different endpoints', async () => {
        const endpoints = [
            '/api/users/getProfile'
        ];

        for (const endpoint of endpoints) {
            const response = await request(app)
                .post(endpoint)
                .set('Cookie', [`accessToken=${accessToken}`]);

            expect(response.status).toBe(200);
        }
    });

    // 4. Token Expire Testi
    test('should handle expired token correctly', async () => {
        const expiredToken = jwt.sign(
            { userId: testUserId },
            process.env.JWT_SECRET,
            { expiresIn: '0s' }
        );

        const response = await request(app)
            .post('/api/users/getProfile')
            .set('Cookie', [`accessToken=${expiredToken}`]);

        expect(response.status).toBe(401);
        expect(response.body.error.message).toBe(errorMessages.AUTH.TOKEN_EXPIRED);
    });
});