const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API documentation',
      version: '1.0.0',
      description: 'API documentation for ecommerce app'
    },
    servers: [
      {
        url: 'http://localhost:3000'
      }
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              format: 'int64'
            },
            username: {
              type: 'string'
            },
            email: {
              type: 'string'
            },
            password: {
              type: 'string'
            }
          },
          required: ['id', 'username', 'email', 'password']
        }
      }
    }
  },
  apis: ['./server.js'], // Path to the API files
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
