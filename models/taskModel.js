const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'Please enter a task title'],
        minlength: 3,
        maxlength: 100
    },
    description: { 
        type: String, 
        required: [true , 'Please enter a task description'],
        minlength: 10
    },
    status: { 
        type: String, 
        enum: ['pending', 'in-progess', 'completed'],
        default: 'pending'
    },
    dueDate: {
        type: Date, 
        required: [true, 'Please provide a due date']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Task', taskSchema);