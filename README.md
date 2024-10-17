# task-manager-api
Task Manager API using nodejs &amp; express with EJS

# Core Dependencies
express mongoose jsonwebtoken bcryptjs cors dotenv express-validator multer helmet morgan express-rate-limit compression cookie-parse

# Security Packages
xss-clean express-mongo-sanitize rate-limiter-flexible

# Utilities
uuid winston nodemailer

# Development Dependencies
nodemon eslint prettier jest supertest sinon chai cross-env

# .env (Environment Variables)
PORT=
MONGO_DB_URI=
JWT_SECRET_KEY=

# To generate secret key
Goto your "git bash" and locate to your project directory then followed by run the below command,
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
