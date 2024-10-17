const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        minLength: 3,
        maxLength: 50
    },
    email: { 
        type: String, 
        required: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email'] 
    },
    password: { 
        type: String, 
        required: [ true, 'Please enter your password'],
        minLength: 6
    },
    role: { 
        type: String,
        enum: ['admin', 'user'],
        default: 'user'        
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

// middleware to hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password =  await bcrypt.hash(this.password, salt);
    next();
});

// method to compare passwords for login
userSchema.methods.matchPassword =  async (enterPassword) => {
    return await bcrypt.compare(enterPassword, this.password);
}

module.exports = mongoose.model('User', userSchema);