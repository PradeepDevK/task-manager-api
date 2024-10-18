const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        // This assumes that the user info is attached to req via the auth middleware
        const user = req.user;

        if (!user)
            return res.status(401).json({ message: 'unauhtorized' });

        if (!allowedRoles.includes(user.role))
            return res.status(403).json({ message: `Access denied. Requires ${requiredRole} role.` });

        next();
    }
};

module.exports = roleMiddleware;