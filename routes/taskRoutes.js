const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { createTask, getTasks, getTaskById, updateTaskById, deleteTask, markTaskAsComplete } = require('../controllers/taskController');
const { validateTaskCreation, validateTaskUpdate } = require('../validators/taskValidator');
const { validationResult } = require('express-validator');
const router = express.Router();

// Middleware to handle validaiton errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    next();
};

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - status
 *         - dueDate
 *         - user
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the task
 *         title:
 *           type: string
 *           description: Task Title
 *         description:
 *           type: string
 *           description: Task Description
 *         status:
 *           type: string
 *           enum: [pending, in-progress, completed]
 *           description: Task Status
 *         dueDate:
 *           type: string
 *           format: date
 *           description: Due date for the task
 *         user:
 *           type: string
 *           description: The ID of the user who created the task
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Task creation timestamp
 */


/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *           example:
 *             title: Create Job Scheduler
 *             description: Scheduler for workflow execution
 *             status: pending
 *             dueDate: 2024-10-24
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/', authMiddleware, validateTaskCreation, handleValidationErrors, createTask);

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks for the logged in user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       500:
 *         description: Server error
 */
router.get('/', authMiddleware, getTasks);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the task
 *     responses:
 *       200:
 *         description: Task found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authMiddleware, getTaskById);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task by ID (admin, manager only)
 *     tags: [Tasks]
 *     security:
 *       - bearerToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authMiddleware, roleMiddleware(['admin', 'manager']), validateTaskUpdate, handleValidationErrors, updateTaskById);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID (admin only)
 *     tags: [Tasks]
 *     security:
 *       - bearerToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the task
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteTask);

/**
 * @swagger
 *   /tasks/{id}/complete:
 *     patch:
 *       summary: Mark a task as completed
 *       tags: [Tasks]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - inpath:
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: The ID of the task to mark the completed
 *     responses:
 *       200:
 *         description: Task marked as completed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found 
 *       500:
 *         description: Server error
 */
router.patch('/:id/complete', authMiddleware, markTaskAsComplete);

module.exports = router;