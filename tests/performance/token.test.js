const TokenService = require('../../services/TokenService');
const { performance } = require('perf_hooks');
const mongoose = require('mongoose');

// Test öncesi environment variables'ı ayarla
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key';

describe('Token Performance Tests', () => {
    const testUserId = new mongoose.Types.ObjectId(); // Geçerli bir ObjectId oluştur

    test('should verify token within acceptable time', async () => {
        const token = TokenService.createTokenPair(testUserId).accessToken;
        
        const start = performance.now();
        await TokenService.verifyAndDecodeToken(token);
        const end = performance.now();
        
        const executionTime = end - start;
        expect(executionTime).toBeLessThan(50); // 50ms'den az sürmeli
    });

    test('should handle blacklist check efficiently', async () => {
        const token = TokenService.createTokenPair(testUserId).accessToken;
        
        const start = performance.now();
        await TokenService.blacklistToken(token, testUserId);
        const end = performance.now();
        
        const executionTime = end - start;
        expect(executionTime).toBeLessThan(100); // 100ms'den az sürmeli
    });
}); 