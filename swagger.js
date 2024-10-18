const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Task Manager API',
            version: '1.0.0',
            description: 'API documentation for Task Manager application'
        },
        servers: [
            {
                url: 'http://localhost:3000/api', 
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./routes/*.js', './models/*.js'], // Paths to API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

module.exports = {
    swaggerUi,
    swaggerDocs
};