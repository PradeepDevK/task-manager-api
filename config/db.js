const mongoose = require('mongoose');
require('dotenv').config(); // Ensure the environment variables are loaded

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully.');
    } catch (err) {
        console.error(`MongoDB connection err: ${err}`);
        process.exit(1); // Exit with the failure
    }
};

module.exports =  connectDB;