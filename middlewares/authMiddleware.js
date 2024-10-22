const jwt =  require('jsonwebtoken');
const User = require('../models/userModel');
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Expecting the bearer token

    if (!token)
        return res.status(401).json({ message: 'No token, authorization denied.' });

    try {
        // Normal jwt token verification
        // const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // req.user = await User.findById(decoded.id).select('-password'); //Attach the user object to the request
        // next();

        // Verify access token
        jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Inavlid or expire access token' });
            }

            req.user = user;
            next();
        });
    } catch (err) {
        res.status(401).json({ message: 'Invalid Token' });
    }
};

module.exports = authMiddleware;