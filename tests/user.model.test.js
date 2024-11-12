const User = require('../models/userModel');

describe('User Model', () => {
    it('should create a new user', async () => {
       const user = new User({
            name: 'testuser',
            email: 'testuser@example.com',
            password: 'password123'
       });

       try {
            console.log("Attempting to save user...");
            const savedUser = await user.save();
            console.log("User Saved:", savedUser);

            expect(savedUser._id).toBeDefined();
            expect(savedUser.name).toBe('testuser');
            expect(savedUser.email).toBe('testuser@example.com');
        } catch (error) {
            console.error("Error saving user:", error);
            throw error;
        }
    });

    it('should not save a user without required fields', async () => {
        const user = new User({});
        let err;
        try {
            await user.save();
        } catch(error) {
            err = error;
        }
        expect(err).toBeInstanceOf(Error);
    });
});