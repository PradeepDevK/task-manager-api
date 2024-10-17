const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT
const generateToken =  (userId) => {
    return jwt.sign({ id: userId}, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
};

// @desc Register new user
// @route POST /api/auth/register
// @access Public
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // check if the user already exists
        const userExists = await User.findOne({ email });
        if (userExists)
            return res.status(400).json({ message: 'User already exists' });

        // create a new user instance
        const user = new User({
            name,
            email,
            password
        });

        // save the user in the DB
        await user.save();

        // generate JWT token
        const token = generateToken(user._id);

        // respond the user data with token
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc Authenticate user & get token (Login)
// @route POST /api/auth/login
// @access Public
exports.loginUser = async (req, res) => {
    const  { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: 'Invalid Credentials' });

        // check if the password matches
        const isMatch = await user.matchPassword(password);
        if (!isMatch)
            return res.status(400).json({ message: 'Invalid Credentials' });

        // generate JWT token
        const token = generateToken(user._id);

        // respond with user info and token
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}