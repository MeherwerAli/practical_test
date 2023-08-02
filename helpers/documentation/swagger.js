const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const { updateRefs, mainConfig } = require('./updateRefs');
const refPath = require('./schemasRef');

// Update the $ref values for each path according to keys in refPath
Object.keys(refPath.refPath).forEach((modelName) => {
  updateRefs(mainConfig, modelName, refPath.refPath[modelName]);
});

const swaggerOptions = {
  swaggerDefinition: mainConfig,
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
