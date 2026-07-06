import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ticket Management API - Documentación Completa',
      version: '1.0.0',
      description: `
## 🎫 Ticket Management API - Sistema de Gestión de Tickets

API RESTful completa para gestión de tickets de soporte con autenticación JWT, roles de usuario, 
y sistema de comentarios integrado.

### 🎯 Propósito
- Gestionar tickets de soporte/incidencias
- Seguimiento de problemas y su resolución
- Colaboración entre usuarios y técnicos
- Auditoría de cambios

### 🔐 Seguridad
- Autenticación con JWT (JSON Web Tokens)
- Control de roles (USER, TECHNICIAN, ADMIN)
- Hasheo de contraseñas con bcryptjs
- CORS configurado
- Helmet para seguridad HTTP

### 📊 Características Principales
- **Autenticación**: Registro, login, refresh token, logout
- **Tickets**: CRUD completo con estados y prioridades
- **Comentarios**: Comunicación en tiempo real sobre tickets
- **Roles**: Control granular de permisos por rol
- **Validación**: Zod para validación en runtime
- **Documentación**: Swagger UI interactivo

### 📱 Clientes Típicos
- **Frontend Web/Mobile**: React, Vue, Angular, React Native
- **Integraciones**: Webhooks, APIs de terceros
- **Reportes**: Clientes de BI

### 🚀 Inicio Rápido
1. Registrarse: \`POST /auth/register\`
2. Login: \`POST /auth/login\` (obtener token)
3. Crear ticket: \`POST /tickets/create\` (con token)
4. Comentar: \`POST /comment/created/{id}\`

      `,
      contact: {
        name: 'API Support',
        email: 'support@ticketapp.com',
        url: 'https://github.com/tu-usuario/ticket-api',
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC',
      },
    },
    externalDocs: {
      description: 'Documentación completa en GitHub',
      url: 'https://github.com/tu-usuario/ticket-api#readme',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo local',
        variables: {
          basePath: {
            default: '/api',
          },
        },
      },
      {
        url: 'http://localhost:8000',
        description: 'Servidor alternativo (puerto 8000)',
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
          description: `
Token JWT para autenticación. 

**Cómo obtener:**
1. Registrarse: POST /auth/register
2. Login: POST /auth/login
3. Copiar el accessToken de la respuesta

**Cómo usar:**
Incluir en el header de todas las solicitudes protegidas:
\`\`\`
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

**Duración:**
- Access Token: 1 hora
- Refresh Token: 7 días
          `,
        },
      },
      schemas: {
        User: {
          type: 'object',
          description: 'Modelo de Usuario del sistema',
          required: ['id', 'name', 'email', 'role'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único del usuario (auto-incrementado)',
              example: 1,
            },
            name: {
              type: 'string',
              description: 'Nombre completo del usuario',
              minLength: 2,
              maxLength: 100,
              example: 'Juan Pérez García',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email único del usuario (login)',
              example: 'juan.perez@example.com',
            },
            role: {
              type: 'string',
              enum: ['USER', 'TECHNICIAN', 'ADMIN'],
              description: `
Rol del usuario que determina permisos:
- **USER**: Puede crear tickets y comentar
- **TECHNICIAN**: Puede gestionar tickets y ver todos
- **ADMIN**: Acceso total al sistema
              `,
              example: 'USER',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación del usuario',
              example: '2024-01-15T10:30:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de última actualización',
              example: '2024-01-15T10:30:00.000Z',
            },
          },
        },
        Ticket: {
          type: 'object',
          description: 'Modelo de Ticket - Problema o solicitud de soporte',
          required: ['id', 'title', 'description', 'status', 'priority', 'userId'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único del ticket (UUID)',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
            title: {
              type: 'string',
              minLength: 5,
              maxLength: 100,
              description: 'Título conciso del problema',
              example: 'Error en sistema de pago',
            },
            description: {
              type: 'string',
              minLength: 10,
              maxLength: 2000,
              description: 'Descripción detallada del problema',
              example: 'El sistema de pago retorna error 500 al procesar transacciones con tarjeta de crédito',
            },
            status: {
              type: 'string',
              enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
              description: `
Estado del ticket (ciclo de vida):
- **OPEN**: Ticket nuevo, sin atender
- **IN_PROGRESS**: Técnico está trabajando
- **RESOLVED**: Solución implementada
- **CLOSED**: Confirmado por usuario, finalizado
              `,
              example: 'OPEN',
            },
            priority: {
              type: 'string',
              enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
              description: `
Prioridad del ticket (urgencia):
- **LOW**: Mejora, no es urgente (SLA: 2 semanas)
- **MEDIUM**: Problema moderado (SLA: 5 días)
- **HIGH**: Problema importante (SLA: 1 día)
- **CRITICAL**: Sistema caído/crítico (SLA: 1 hora)
              `,
              example: 'CRITICAL',
            },
            asignatedTo: {
              type: 'string',
              format: 'email',
              description: 'Email del técnico responsable del ticket',
              example: 'soporte-tecnico@ticketapp.com',
            },
            userId: {
              type: 'integer',
              description: 'ID del usuario que creó el ticket',
              example: 1,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación del ticket',
              example: '2024-01-15T10:30:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de última actualización',
              example: '2024-01-15T11:45:30.000Z',
            },
          },
        },
        Comment: {
          type: 'object',
          description: 'Modelo de Comentario - Comunicación en un ticket',
          required: ['id', 'content', 'ticketId', 'userId'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único del comentario',
              example: '660e8500-f29b-41d4-a716-446655440000',
            },
            content: {
              type: 'string',
              minLength: 1,
              maxLength: 2000,
              description: 'Contenido del comentario',
              example: 'He investigado el problema. Es un timeout en la BD de pagos.',
            },
            ticketId: {
              type: 'string',
              format: 'uuid',
              description: 'ID del ticket al que pertenece el comentario',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
            userId: {
              type: 'integer',
              description: 'ID del usuario que hizo el comentario',
              example: 2,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación del comentario',
              example: '2024-01-15T10:35:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de última actualización',
              example: '2024-01-15T10:35:00.000Z',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          description: 'Solicitud de inicio de sesión',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'juan@example.com',
              description: 'Email del usuario registrado',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'MiPassword123!',
              description: 'Contraseña del usuario',
            },
          },
          example: {
            email: 'juan.perez@example.com',
            password: 'MiPassword123!',
          },
        },
        RegisterRequest: {
          type: 'object',
          description: 'Solicitud de registro de nuevo usuario',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              minLength: 2,
              example: 'Juan Pérez',
              description: 'Nombre completo del usuario a registrar',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'juan@example.com',
              description: 'Email único para la cuenta',
            },
            password: {
              type: 'string',
              format: 'password',
              minLength: 8,
              example: 'MiPassword123!',
              description: 'Contraseña segura (mínimo 8 caracteres)',
            },
          },
          example: {
            name: 'Juan Pérez García',
            email: 'juan.perez@example.com',
            password: 'MiPassword123!',
          },
        },
        AuthResponse: {
          type: 'object',
          description: 'Respuesta de autenticación con token JWT',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Login exitoso',
            },
            data: {
              type: 'object',
              properties: {
                accessToken: {
                  type: 'string',
                  description: 'JWT token para usar en solicitudes protegidas',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
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
          description: 'Respuesta de error estándar',
          required: ['success', 'message', 'status'],
          properties: {
            success: {
              type: 'boolean',
              example: false,
              description: 'Indicador de éxito (siempre false en errores)',
            },
            message: {
              type: 'string',
              example: 'Email ya está registrado',
              description: 'Descripción del error',
            },
            status: {
              type: 'integer',
              example: 400,
              description: 'Código HTTP del error',
            },
          },
        },
        SuccessResponse: {
          type: 'object',
          description: 'Respuesta exitosa genérica',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Operación realizada exitosamente',
            },
            data: {
              type: 'object',
              description: 'Datos variados según el endpoint',
            },
          },
        },
      },
    },
  },
  apis: ['./src/**/*.ts'],
};

export const specs = swaggerJsdoc(options);
