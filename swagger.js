const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Configuración de Swagger
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'API de Cineflix',
      description: 'Documentación de la API de Cineflix',
      version: '1.0.0',
    },
  },
  apis: ['./server.js'], // Ruta al archivo principal de tu aplicación
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Configuración de la ruta para visualizar la documentación de Swagger
module.exports = function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};