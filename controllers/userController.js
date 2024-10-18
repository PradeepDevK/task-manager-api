const User = require('../models/userModel');
const appConfig = require('../config/appConfig');

// @route PUT /users/role
// @desc Update a user's role (admin only)
// @access Private (admin only)
const updateUserRole = async (req, res) => {
    try {
        const { userId, newRole } = req.body;
        const validRoles = appConfig.validRoles;

        // Check if the new role is valid
        if (!validRoles.includes(newRole))
            return res.status(400).json({ message: 'Invalid Role' });

        // Find the user and update their role
        const user = await User.findById(userId);

        if (!user)
            return res.status(404).json({ message: 'User not found' });

        user.role =  newRole;
        await user.save();

        res.status(200).json({ message: 'User role updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = {
    updateUserRole
};