const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  info: {
    // API information (required)
    title: 'Enlighten Api', // Title (required)
    version: '1.0.0', // Version (required)
    description: 'Enlighten api docs', // Description (optional)
  },
  basePath: '/', // Base path (optional)
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'], // <-- not in the definition, but in the options
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
