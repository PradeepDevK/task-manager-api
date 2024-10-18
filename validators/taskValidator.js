const { body } = require('express-validator');

// Validation rules for creating a task 
const validateTaskCreation = [
    body('title')
        .isLength({ min: 3 })
        .withMessage('Title must be at least 3 characters long'),
    body('description')
        .isLength({ min: 10 })
        .withMessage('Description must be at least 10 characters long'),
    body('dueDate')
        .isISO8601()
        .withMessage('Due data must be a valid date')
];

// Validation rules for updating a task
const validateTaskUpdate = [
    body('title')
        .optional()
        .isLength({ min: 3 })
        .withMessage('Title must be at least 3 characters long'),
    body('description')
        .optional()
        .isLength({ min: 10 })
        .withMessage('Description must be at least 10 characters long'),
    body('dueDate')
        .optional()
        .isISO8601()
        .withMessage('Due data must be a valid date'),
    body('status')
        .optional()
        .isIn(['pending', 'in-progress', 'completed'])
        .withMessage('Invalid Status'),
];

module.exports = {
    validateTaskCreation,
    validateTaskUpdate
};