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

// @route GET /api/users/
// @desc Get all users (admin only)
// @access Private (admin only)
const getAllusers = async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // Exclude password field
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// @route GET /api/users/:id
// @desc Get a user by ID (admin only)
// @access Private (admin only)
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id, '-password'); // Exclued password field

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

// @route DELETE /api/users/:id
// @desc Delete a user by ID (admin only)
// @access Private (admin only)
const deleteUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        await user.remove();
        res.status(200).json({ message: 'User deleted successfully.' });
    } catch(error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// @route PUT /api/users
// @desc Update user profile (for all users)
// @access Private (for all users)
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Allow updating only certain fields
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            user.password = req.password; // Password will be hashed by the pre-save hook
        }

        const updatedUser = await user.save();

        res.status(200).json({
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const addNewUserProfile = async (req, res) => {
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

        // respond the user data with token
        res.status(201).json({
            message: 'User profile created successfully',
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

module.exports = {
    updateUserRole,
    getAllusers,
    getUserById,
    updateUserProfile,
    deleteUserById,
    addNewUserProfile
};