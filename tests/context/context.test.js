const request = require('supertest');
const { app } = require('../../server');
const { getRequestContext } = require('../../middleware/requestContext');
const User = require('../../models/User');
const { hashPassword } = require('../../utils/hashPassword');

describe('Context Isolation Tests', () => {
    let firstUser;
    let secondUser;
    let firstToken;
    let secondToken;

    beforeEach(async () => {
        // Test kullanıcılarını oluştur
        firstUser = await User.create({
            name: 'Ali Caglar',
            surname: 'Kocer',
            email: 'alicaglarkocer@gmail.com',
            phone: '5521791303',
            password: await hashPassword('Password123')
        });

        secondUser = await User.create({
            name: 'Buket',
            surname: 'Kocer',
            email: 'buketkocer@gmail.com',
            phone: '5511050729',
            password: await hashPassword('Password123')
        });

        // Kullanıcıları login et
        const firstResponse = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test1@example.com',
                password: 'Password123'
            });

        const secondResponse = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test2@example.com',
                password: 'Password123'
            });

        firstToken = firstResponse.body.accessToken;
        secondToken = secondResponse.body.accessToken;
    });

    test('parallel requests should maintain separate contexts', async () => {
        const requests = [
            request(app)
                .post('/api/users/getProfile')
                .set('Authorization', `Bearer ${firstToken}`),
            request(app)
                .post('/api/users/getProfile')
                .set('Authorization', `Bearer ${secondToken}`)
        ];

        const responses = await Promise.all(requests);

        expect(responses[0].status).toBe(200);
        expect(responses[1].status).toBe(200);

        const firstUserId = responses[0].body.id;
        const secondUserId = responses[1].body.id;
        expect(firstUserId).toBe(firstUser._id.toString());
        expect(secondUserId).toBe(secondUser._id.toString());
        expect(firstUserId).not.toBe(secondUserId);
    });

    test('same user multiple requests should maintain request isolation', async () => {
        const requests = [
            request(app)
                .post('/api/users/getProfile')
                .set('Authorization', `Bearer ${firstToken}`),
            request(app)
                .post('/api/users/changePassword')
                .set('Authorization', `Bearer ${firstToken}`)
                .send({
                    currentPassword: 'Password123',
                    newPassword: 'NewPassword123'
                })
        ];

        const responses = await Promise.all(requests);

        expect(responses[0].status).toBe(200);
        expect(responses[1].status).toBe(200);
        expect(responses[0].body.id).toBe(firstUser._id.toString());
        expect(responses[1].body.message).toBe('Şifre başarıyla değiştirildi.');
    });
}); 