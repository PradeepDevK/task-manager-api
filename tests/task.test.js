const request =  require('supertest');
const app = require('../app');
const Task = require('../models/taskModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');


let token;

beforeAll(async () => {
    const user = await User.create({
        name: 'testuser',
        email: 'testuser@example.com',
        password: 'password123'
    });

    token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' },
    );
});

describe('Task Routes', () => {
    it('should create a new task', async () => {
        const res =  await request(app)
            .post('/api/tasks/')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Test Task',
                description: 'A test task.',
                dueDate: new Date()
            });
        
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('task');
        expect(res.body.task).toHaveProperty('title', 'Test Task');
    });
});