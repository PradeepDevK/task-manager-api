const app = require('./app'); // Import the Express app
const connectDB = require('./config/db'); // Import the DB Connection
require('dotenv').config(); // To load environment variables .env

const PORT = process.env.PORT || 3000;

// Connect to the DB
connectDB();

// Start the Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});