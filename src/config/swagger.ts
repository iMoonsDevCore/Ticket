import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ticket Management API',
      version: '1.0.0',
      description: 'API para gestión de tickets con soporte para autenticación, comentarios y seguimiento.',
      contact: {
        name: 'API Support',
        email: 'support@ticketapp.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo',
      },
      {
        url: 'https://api.ticketapp.com',
        description: 'Servidor de producción',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT para autenticación',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            name: {
              type: 'string',
              example: 'Juan Pérez',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'juan@example.com',
            },
            role: {
              type: 'string',
              enum: ['USER', 'TECHNICIAN', 'ADMIN'],
              example: 'USER',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Ticket: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
            title: {
              type: 'string',
              example: 'Error en el sistema de login',
            },
            description: {
              type: 'string',
              example: 'Los usuarios no pueden iniciar sesión correctamente',
            },
            status: {
              type: 'string',
              enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
              example: 'OPEN',
            },
            priority: {
              type: 'string',
              enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
              example: 'HIGH',
            },
            asignatedTo: {
              type: 'string',
              example: 'tech-team@example.com',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
            userId: {
              type: 'integer',
              example: 1,
            },
          },
        },
        Comment: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            content: {
              type: 'string',
              example: 'He revisado el problema y lo estoy solucionando',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
            ticketId: {
              type: 'string',
              format: 'uuid',
            },
            userId: {
              type: 'integer',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'juan@example.com',
            },
            password: {
              type: 'string',
              example: 'Contraseña123!',
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              example: 'Juan Pérez',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'juan@example.com',
            },
            password: {
              type: 'string',
              example: 'Contraseña123!',
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
            },
            message: {
              type: 'string',
            },
            data: {
              type: 'object',
              properties: {
                accessToken: {
                  type: 'string',
                },
                user: {
                  $ref: '#/components/schemas/User',
                },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
            status: {
              type: 'integer',
              example: 400,
            },
          },
        },
      },
    },
  },
  apis: ['./src/**/*.ts'],
};

export const specs = swaggerJsdoc(options);
