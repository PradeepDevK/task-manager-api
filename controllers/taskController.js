const Task = require('../models/taskModel');
const { validationResult } = require('express-validator');


// @desc Create a new task
// @route POST /tasks
// @access Private
exports.createTask = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

    const { title, description, dueDate } = req.body;

    try {
        const task =  new Task({
            title,
            description,
            dueDate,
            user: req.user, // User from the authMiddleware
        });

        await task.save();

        res.status(201).json({
            message: 'Task created successfully',
            task,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

// @desc Get all task
// @route GET /tasks
// @access Private
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user }); // Get tasks for the logged-in user
        res.status(200).json({ data: tasks });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc Get task by ID
// @route GET /tasks/:id
// @access Private
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id); // Get task by task id

        if (!task || task.user.toString() !== req.user) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ data: task });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc Update task by ID
// @route PUT /tasks/:id
// @access Private
exports.updateTaskById = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

    try {
        const task = await Task.findById(req.params.id);

        if (!task || task.user.toString() !== req.user) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Update the task fields
        const updatedTask =  await Task.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            },
            {
                new: true
            }
        );

        res.status(200).json({
            message: 'Task updated successfully',
            updatedTask
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc Delete task by ID
// @route DELETE /tasks/:id
// @access Private
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task || task.user.toString() !== req.user) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await task.remove();
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch(error) {
        res.status(500).json({ message: 'Server Error'});
    }
};

// @desc Mark task as completed
// @route Patch /api/tasks/:id/complete
// @access Private (all roles)
exports.markTaskAsComplete = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Update the status as "completed"
        task.status = 'completed';
        await task.save();

        res.status(200).json({ message: 'Task marked as completed', task });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};