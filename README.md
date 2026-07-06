# 🎫 Ticket Management API

Una aplicación de gestión de tickets moderna y escalable construida con **Node.js**, **Express**, **TypeScript** y **Prisma**, con autenticación JWT, validación robusta y documentación interactiva con Swagger.

---

## 📋 Tabla de Contenidos

- [Características](#características)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Documentación API](#documentación-api)
- [Endpoints](#endpoints)
- [Autenticación](#autenticación)
- [Roles y Permisos](#roles-y-permisos)
- [Ejemplo de Uso](#ejemplo-de-uso)
- [Desarrollo](#desarrollo)
- [Variables de Entorno](#variables-de-entorno)

---

## ✨ Características

✅ **Autenticación JWT** - Tokens seguros con acceso y actualización  
✅ **Control de Roles** - Soporte para USER, TECHNICIAN, ADMIN  
✅ **Gestión de Tickets** - CRUD completo con estados y prioridades  
✅ **Sistema de Comentarios** - Comentarios en tickets con validación de permisos  
✅ **Validación Robusta** - Schemas Zod para todos los DTOs  
✅ **Seguridad** - Helmet, CORS, contraseñas con bcryptjs  
✅ **Documentación Swagger** - API interactiva en `/api-docs`  
✅ **Logging** - Morgan para tracking de solicitudes  
✅ **Manejo de Errores** - Middleware centralizado de errores  
✅ **Base de Datos PostgreSQL** - Con Prisma ORM  

---

## 🔧 Requisitos Previos

- **Node.js** >= 16.x
- **npm** >= 8.x o **yarn** >= 1.22.x
- **PostgreSQL** >= 12.x
- **Git** (opcional)

---

## 📦 Instalación

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd ticket-app
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/ticket_db
JWT_SECRET=tu_secreto_super_seguro_aqui
JWT_REFRESH_SECRET=tu_secreto_refresh_seguro_aqui
PORT=3000
NODE_ENV=development
```

### 4. Configurar base de datos

```bash
npx prisma migrate dev --name init
```

### 5. Iniciar el servidor

```bash
npm run dev
```

El servidor estará disponible en: `http://localhost:3000`

---

## 🏗️ Estructura del Proyecto

```
ticket-app/
├── src/
│   ├── config/               # Configuraciones
│   │   ├── env.ts           # Variables de entorno
│   │   ├── prisma.ts        # Cliente Prisma
│   │   └── swagger.ts       # Configuración Swagger
│   ├── modules/             # Módulos funcionales
│   │   ├── auth/            # Autenticación
│   │   │   ├── AuthController.ts
│   │   │   ├── AuthRepository.ts
│   │   │   ├── AuthService.ts
│   │   │   ├── AuthRouter.ts
│   │   │   ├── dto/
│   │   │   └── schemas/
│   │   ├── ticket/          # Gestión de tickets
│   │   │   ├── TicketController.ts
│   │   │   ├── TicketRepository.ts
│   │   │   ├── TicketService.ts
│   │   │   ├── TicketRouter.ts
│   │   │   ├── dto/
│   │   │   └── schemas/
│   │   ├── comments/        # Sistema de comentarios
│   │   │   ├── CommentsController.ts
│   │   │   ├── CommentsRepository.ts
│   │   │   ├── CommentsService.ts
│   │   │   ├── CommentsRouter.ts
│   │   │   ├── dto/
│   │   │   └── schemas/
│   │   ├── middlewares/     # Middlewares
│   │   │   ├── errorHandler.ts
│   │   │   ├── helmet.ts
│   │   │   ├── morgan.ts
│   │   │   ├── router.ts
│   │   │   ├── verifyRole.ts
│   │   │   └── verifyToken.ts
│   │   ├── helpers/         # Utilidades
│   │   │   ├── AppError.ts
│   │   │   └── jwt.ts
│   │   └── user/            # Interfaz de usuario
│   │       └── user.interface.ts
│   ├── types/               # Tipos TypeScript
│   ├── app.ts              # Configuración de Express
│   └── index.ts            # Punto de entrada
├── prisma/
│   ├── schema.prisma       # Esquema de base de datos
│   └── migrations/         # Historial de migraciones
├── package.json
├── tsconfig.json
├── .env                    # Variables de entorno
└── README.md              # Este archivo
```

---

## 📖 Documentación API

### Acceder a la documentación interactiva

Una vez que el servidor esté corriendo, accede a:

```
http://localhost:3000/api-docs
```

Aquí puedes:
- 📖 Ver todos los endpoints disponibles
- 🧪 Probar los endpoints directamente
- 🔐 Configurar autenticación Bearer Token
- 📊 Ver esquemas de request/response

---

## 🔌 Endpoints

### 🔐 Autenticación (`/api/auth`)

#### Registrar usuario
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "Contraseña123!"
}
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "accessToken": "eyJhbGc...",
    "user": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "role": "USER",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

#### Iniciar sesión
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "Contraseña123!"
}
```

#### Refrescar token
```http
POST /api/auth/refresh
```

#### Cerrar sesión
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

#### Obtener datos del token
```http
GET /api/auth/mytoken
Authorization: Bearer <token>
```

---

### 🎫 Tickets (`/api/tickets`)

#### Obtener todos los tickets
```http
GET /api/tickets
Authorization: Bearer <token>
```

**Requerimiento:** Roles TECHNICIAN o ADMIN

#### Obtener ticket por ID
```http
GET /api/tickets/:id
Authorization: Bearer <token>
```

#### Crear nuevo ticket
```http
POST /api/tickets/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Error en el sistema de login",
  "description": "Los usuarios no pueden iniciar sesión correctamente",
  "priority": "HIGH",
  "asignedTo": "tech-team@example.com"
}
```

**Requerimiento:** Cualquier usuario autenticado

#### Actualizar ticket
```http
PUT /api/tickets/update/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Error en el sistema de login",
  "description": "Descripción actualizada",
  "status": "IN_PROGRESS",
  "priority": "CRITICAL"
}
```

**Requerimiento:** Roles TECHNICIAN o ADMIN

#### Eliminar ticket
```http
DELETE /api/tickets/delete/:id
Authorization: Bearer <token>
```

**Requerimiento:** Roles TECHNICIAN o ADMIN

---

### 💬 Comentarios (`/api/comment`)

#### Obtener todos los comentarios
```http
GET /api/comment
Authorization: Bearer <token>
```

**Requerimiento:** Roles TECHNICIAN o ADMIN

#### Crear comentario
```http
POST /api/comment/created/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "ticketId": "550e8400-e29b-41d4-a716-446655440000",
  "content": "He revisado el problema y lo estoy solucionando"
}
```

**Requerimiento:** Cualquier usuario autenticado

#### Actualizar comentario
```http
PUT /api/comment/edit/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Contenido actualizado del comentario"
}
```

**Requerimiento:** Propietario del comentario o ADMIN

#### Eliminar comentario
```http
DELETE /api/comment/:id
Authorization: Bearer <token>
```

**Requerimiento:** Propietario del comentario o ADMIN

---

## 🔐 Autenticación

La API usa **JWT (JSON Web Tokens)** para autenticación. 

### Flujo de autenticación:

1. **Registro o Login** → Recibe `accessToken`
2. **Usar Token** → Incluir en header: `Authorization: Bearer <token>`
3. **Token Expirado** → Usar endpoint `/api/auth/refresh`

### Ejemplo con cURL:

```bash
# Registrarse
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan",
    "email": "juan@example.com",
    "password": "Pass123!"
  }'

# Obtener tickets (con token)
curl -X GET http://localhost:3000/api/tickets \
  -H "Authorization: Bearer eyJhbGc..."
```

---

## 👥 Roles y Permisos

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| **USER** | Usuario estándar | Crear tickets, comentar en tickets |
| **TECHNICIAN** | Técnico de soporte | Ver todos los tickets, actualizar estado, comentar |
| **ADMIN** | Administrador | Acceso total, gestión de usuarios, auditoría |

### Matriz de permisos:

| Acción | USER | TECHNICIAN | ADMIN |
|--------|------|-----------|-------|
| Crear Ticket | ✅ | ✅ | ✅ |
| Ver todos los tickets | ❌ | ✅ | ✅ |
| Actualizar ticket | ❌ | ✅ | ✅ |
| Eliminar ticket | ❌ | ✅ | ✅ |
| Comentar | ✅ | ✅ | ✅ |
| Editar propio comentario | ✅ | ✅ | ✅ |

---

## 📝 Ejemplo de Uso

### Caso de uso completo: Crear y comentar un ticket

```bash
# 1. Registrarse
TOKEN=$(curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Soporte",
    "email": "soporte@example.com",
    "password": "Password123!"
  }' | jq -r '.data.accessToken')

# 2. Crear un ticket
TICKET_ID=$(curl -X POST http://localhost:3000/api/tickets/create \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "No funciona el pago",
    "description": "El sistema de pago está caído",
    "priority": "CRITICAL",
    "asignedTo": "tech@example.com"
  }' | jq -r '.data.id')

# 3. Comentar en el ticket
curl -X POST http://localhost:3000/api/comment/created/$TICKET_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Estamos investigando el problema"
  }'
```

---

## 🛠️ Desarrollo

### Ejecutar en modo desarrollo

```bash
npm run dev
```

El servidor se reinicia automáticamente cuando cambias archivos (con `ts-node-dev`).

### Ejecutar Prisma Studio

```bash
npx prisma studio
```

Abre una interfaz gráfica para visualizar y editar datos en la base de datos.

### Generar tipos Prisma

```bash
npx prisma generate
```

### Crear nueva migración

```bash
npx prisma migrate dev --name nombre_migracion
```

---

## 🌍 Variables de Entorno

Copia `.env.example` a `.env` y configura:

```env
# Base de Datos
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/ticket_db

# JWT
JWT_SECRET=tu_secreto_super_seguro_minimo_32_caracteres
JWT_REFRESH_SECRET=tu_secreto_refresh_super_seguro_32_caracteres

# Servidor
PORT=3000
NODE_ENV=development|production

# CORS (Opcional)
CORS_ORIGIN=http://localhost:3000

# Base de datos en producción
DATABASE_URL_PROD=postgresql://usuario:contraseña@prod-host:5432/ticket_db_prod
```

⚠️ **Nunca** commits `.env` a Git. Usa `.env.example` como template.

---

## 📚 Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Runtime** | Node.js 16+ |
| **Lenguaje** | TypeScript 5.9 |
| **Framework Web** | Express 5.2 |
| **Base de Datos** | PostgreSQL 12+ |
| **ORM** | Prisma 6.19 |
| **Validación** | Zod 4.4 |
| **Autenticación** | JWT con jsonwebtoken |
| **Contraseñas** | bcryptjs |
| **Seguridad** | Helmet, CORS |
| **Logging** | Morgan |
| **Documentación** | Swagger/OpenAPI |
| **Desarrollo** | ts-node-dev |

---

## 🚀 Despliegue

### Desplegar en Heroku

```bash
# Instalar CLI de Heroku
npm install -g heroku

# Login
heroku login

# Crear app
heroku create nombre-app

# Configurar variables de entorno
heroku config:set JWT_SECRET="tu_secreto"
heroku config:set DATABASE_URL="tu_url_prod"

# Deploy
git push heroku main
```

### Desplegar en Railway

1. Conecta tu repositorio GitHub
2. Configura las variables de entorno
3. Railway despliega automáticamente

---

## 🐛 Solución de Problemas

### Error de conexión a base de datos

```bash
# Verificar conexión
psql $DATABASE_URL

# Reiniciar migraciones
npx prisma migrate reset
```

### Token expirado

```bash
# Usar endpoint de refresh
curl -X POST http://localhost:3000/api/auth/refresh
```

### Puertos en uso

```bash
# Cambiar puerto en .env
PORT=3001
```

---

## 📄 Licencia

Este proyecto está bajo la licencia ISC.

---

## 📧 Contacto

Para preguntas o sugerencias, contacta a: **support@ticketapp.com**

---

## 🙋 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

**Último actualizado:** 2024-01-15
