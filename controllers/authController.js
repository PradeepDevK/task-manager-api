const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Secret keys from JWT tokens
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

// Generate JWT
// const generateToken =  (userId) => {
//     return jwt.sign({ id: userId}, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
// };

// Generate an Access Token
const generateAccessToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' }); // 15 mins expiration
};

// Generate a Refresh Token
const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' }); // 7 days expiration
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
        // const token = generateToken(user._id);

        // Generate Tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        //Optional, in future will save the refresh token in db
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });

        // respond the user data with token
        res.status(201).json({
            message: 'User registered successfully',
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (err) {
        res.status(500).json({ message: 'Server error', err });
    }
};

// @desc Authenticate user & get token (Login)
// @route POST /api/auth/login
// @access Public
exports.loginUser = async (req, res) => {
    const  { email, password } = req.body;
    console.log(req.body)

    try {
        // Find user by email
        const user = await User.findOne({ email });
        console.log(user);
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // check if the password matches
        const isMatch = await user.matchPassword(password);
        console.log(isMatch)
        console.log("isMatch", isMatch);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // generate JWT token
        // const token = generateToken(user._id);

        // Generate Tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        //Optional, in future will save the refresh token in db
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });

        // respond with user info and token
        res.status(200).json({
            message: 'Login successful',
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', err });
    }
}

// @desc Get new access token from refresh token
// @route /api/auth/refresh-token
// @access Private
exports.refreshAccessToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken; // Retrieve the refresh token

    if (!refreshToken) {
        return res.status(403).json({ message: 'Refresh token required' });
    }

    try {
        // Verify the refresh token
        jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
           if (err) {
            return res.status(403).json({ message: 'Invalid refresh token.' });
           }

           // Generate a new access token
           const newAccessToken = generateAccessToken({ id: user.id });

           res.status(200).json({
            accessToken: newAccessToken
           });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
}