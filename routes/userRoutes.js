const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { updateUserRole } = require('../controllers/userController');

const router = express.Router();

/**
 * @swagger
 * /users/role:
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

module.exports = router;