const request = require('supertest');
const { app } = require('../server');
const User = require('../models/User');
const { hashPassword } = require('../utils/hashPassword');
const mongoose = require('mongoose');

// Test veri fabrikası
const createTestUser = (overrides = {}) => ({
    name: 'Buket',
    surname: 'Kocer',
    email: 'buketkocer@gmail.com',
    phone: '5511050729',
    password: 'Password123',
    confirmPassword: 'Password123',
    ...overrides
});

// Ortak beklenti kontrolleri
const expectValidationError = (response, message) => {
    expect(response.status).toBe(400);
    expect(response.body.error.message).toBe(message);
};

describe('Register API Tests', () => {
    let firstUser;

    beforeEach(async () => {
        firstUser = await User.create({
            name: 'Ali Caglar',
            surname: 'Kocer',
            email: 'alicaglarkocer@gmail.com',
            phone: '5521791303',
            password: await hashPassword('Password123')
        });

    });

    describe('Existing Data Validation', () => {
        test('should fail with existing email', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send(createTestUser({ email: firstUser.email }));

            expectValidationError(response, 'Email bilgileri sistemde başka bir kullanıcı tarafından kullanılıyor.');
        });

        test('should fail with existing phone', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send(createTestUser({ phone: firstUser.phone }));

            expectValidationError(response, 'Telefon numarası bilgileri sistemde başka bir kullanıcı tarafından kullanılıyor.');
        });
    });

    describe('Input Format Validation', () => {
        test('should fail with invalid email', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send(createTestUser({ email: 'buketkocer' }));

            expectValidationError(response, 'Geçersiz email adresi.');
        });

        test('should fail with invalid name', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send(createTestUser({ name: 'Buket5' }));

            expectValidationError(response, 'İsim en az 2 karakter olmalı ve sadece harf içermelidir.');
        });

        test('should fail with not matching passwords', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send(createTestUser({ confirmPassword: 'Password1234' }));

            expectValidationError(response, 'Şifreler eşleşmiyor.');
        });
    });

    describe('Success Cases', () => {
        test('should succeed with valid data', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send(createTestUser());

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Kullanıcı başarıyla oluşturuldu.');
        });

        test('should login with valid data', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({email: firstUser.email, password: 'Password123'});

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Giriş başarılı.');
        });
    });
});
