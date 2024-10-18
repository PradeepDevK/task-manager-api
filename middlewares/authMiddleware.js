const jwt =  require('jsonwebtoken');
const User = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Expecting the bearer token

    if (!token)
        return res.status(401).json({ message: 'No token, authorization denied.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = await User.findById(decoded.id).select('-password'); //Attach the user object to the request
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid Token' });
    }
};

module.exports = authMiddleware;