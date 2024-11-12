const request = require('supertest');
const app = require('../app');
const User = require('../models/userModel');

describe('Auth Routes', () => {
    beforeEach(async () => {
        await User.deleteMany();
    });

    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'testuser',
                email: 'testuser@example.com',
                password: 'password123',
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('user');
        expect(res.body.user.email).toBe('testuser@example.com');
    });

    it('should login an existing user', async () => {
        const user = new User({
            name: 'testuser',
            email: 'testuser@example.com',
            password: 'password123'
        });
        await user.save();

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'testuser@example.com',
                password: 'password123',
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('accessToken');
    });
});