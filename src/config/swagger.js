import swaggerJsdoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: '健康管理小程序后端 API',
    version: '1.0.0',
    description: '健康管理小程序后端接口文档'
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  security: [{ bearerAuth: [] }]
};

export const swaggerOptions = {
  swaggerDefinition,
  apis: ['src/router/*.js']
};

export const swaggerSpecs = swaggerJsdoc(swaggerOptions);


