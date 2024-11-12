const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { updateUserRole, updateUserProfile, getAllusers, getUserById, deleteUserById, addNewUserProfile } = require('../controllers/userController');

const router = express.Router();

/**
 * @swagger
 * /api/users/role:
 *   put:
 *     summary: Update a user's role (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user whose role is being updated
 *               newRole:
 *                 type: string
 *                 description: The new role for the user (admin, manager,user)
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       400:
 *         description: Invalid role
 */
router.put('/role', authMiddleware, roleMiddleware(['admin']), updateUserRole);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *       403:
 *         description: Access denied (admin only)
 *       500:
 *         description: Server error
 */
router.get('/', authMiddleware, roleMiddleware(['admin']), getAllusers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: User found
 *       403:
 *         description: Access denied (admin only)
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authMiddleware, roleMiddleware(['admin']), getUserById);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user by ID (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       403:
 *         description: Access denied (admin only)
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteUserById);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update a user profile (all users)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *             name: John Doe
 *             email: john@example.com
 *             password: password123
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       403:
 *         description: Access denied (admin only)
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put('/profile', authMiddleware, updateUserProfile);

/**
 * @swagger
 * /api/users/profile:
 *   post:
 *     summary: Add a new user profile (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           example:
 *             name: John Doe
 *             email: john@example.com
 *             password: password123
 *     responses:
 *       200:
 *         description: User profile created successfully
 *       403:
 *         description: Access denied (admin only)
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post('/profile', authMiddleware, roleMiddleware(['admin']), addNewUserProfile);

module.exports = router;