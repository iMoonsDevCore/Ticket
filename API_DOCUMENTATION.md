# 📖 Documentación de Endpoints API

> **Nota:** Para una experiencia interactiva, accede a `http://localhost:3000/api-docs` (Swagger UI)

---

## 🔐 Autenticación (`/api/auth`)

### 1. Registrar usuario
Crea una nueva cuenta de usuario.

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "Contraseña123!"
}
```

**Parámetros:**
- `name` (string, requerido) - Nombre completo del usuario
- `email` (string, requerido) - Email único
- `password` (string, requerido) - Contraseña (mínimo 8 caracteres)

**Respuesta 201:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "role": "USER",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

**Errores:**
- `400` - Email duplicado o validación fallida
- `500` - Error del servidor

---

### 2. Iniciar sesión
Autentica un usuario existente.

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "Contraseña123!"
}
```

**Parámetros:**
- `email` (string, requerido) - Email del usuario
- `password` (string, requerido) - Contraseña

**Respuesta 200:**
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
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

**Errores:**
- `401` - Credenciales inválidas
- `404` - Usuario no encontrado

---

### 3. Refrescar token
Obtiene un nuevo token de acceso usando el refresh token.

```http
POST /api/auth/refresh
Content-Type: application/json
```

**Respuesta 200:**
```json
{
  "success": true,
  "message": "Token actualizado",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "role": "USER"
    }
  }
}
```

---

### 4. Cerrar sesión
Invalida el refresh token del usuario.

```http
POST /api/auth/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Respuesta 200:**
```json
{
  "success": true,
  "message": "Sesión cerrada exitosamente"
}
```

**Requerimientos:**
- ✅ Autenticación requerida

---

### 5. Obtener datos del token
Obtiene la información del usuario asociado al token actual.

```http
GET /api/auth/mytoken
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Respuesta 200:**
```json
{
  "user": {
    "userId": 1,
    "email": "juan@example.com",
    "role": "USER",
    "iat": 1705316400
  }
}
```

**Requerimientos:**
- ✅ Autenticación requerida

---

## 🎫 Tickets (`/api/tickets`)

### 1. Obtener todos los tickets
Obtiene una lista de todos los tickets (solo para TECHNICIAN y ADMIN).

```http
GET /api/tickets
Authorization: Bearer <token>
```

**Respuesta 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Error en el sistema de login",
      "description": "Los usuarios no pueden iniciar sesión correctamente",
      "status": "OPEN",
      "priority": "HIGH",
      "asignatedTo": "tech@example.com",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "userId": 1
    }
  ]
}
```

**Requerimientos:**
- ✅ Autenticación requerida
- ✅ Rol: TECHNICIAN o ADMIN

**Errores:**
- `401` - No autenticado
- `403` - Permisos insuficientes

---

### 2. Obtener ticket por ID
Obtiene los detalles de un ticket específico.

```http
GET /api/tickets/:id
Authorization: Bearer <token>
```

**Parámetros URL:**
- `id` (string, requerido) - UUID del ticket

**Respuesta 200:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Error en el sistema de login",
    "description": "Los usuarios no pueden iniciar sesión correctamente",
    "status": "OPEN",
    "priority": "HIGH",
    "asignatedTo": "tech@example.com",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "userId": 1
  }
}
```

**Requerimientos:**
- ✅ Autenticación requerida
- ✅ Rol: TECHNICIAN o ADMIN

---

### 3. Crear nuevo ticket
Crea un nuevo ticket de soporte.

```http
POST /api/tickets/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Error en el sistema de login",
  "description": "Los usuarios no pueden iniciar sesión correctamente",
  "priority": "HIGH",
  "asignatedTo": "tech@example.com"
}
```

**Parámetros:**
- `title` (string, requerido) - Título del ticket (máx 100 caracteres)
- `description` (string, requerido) - Descripción detallada (máx 2000 caracteres)
- `priority` (string, requerido) - Prioridad: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`
- `asignatedTo` (string, requerido) - Email del encargado

**Respuesta 201:**
```json
{
  "success": true,
  "message": "Ticket creado exitosamente",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Error en el sistema de login",
    "description": "Los usuarios no pueden iniciar sesión correctamente",
    "status": "OPEN",
    "priority": "HIGH",
    "asignatedTo": "tech@example.com",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "userId": 1
  }
}
```

**Requerimientos:**
- ✅ Autenticación requerida
- ✅ Rol: USER, TECHNICIAN, o ADMIN

**Errores:**
- `400` - Validación fallida
- `401` - No autenticado

---

### 4. Actualizar ticket
Actualiza los detalles de un ticket existente.

```http
PUT /api/tickets/update/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Error en el sistema de login - URGENTE",
  "description": "Los usuarios no pueden iniciar sesión correctamente. Impacto crítico.",
  "status": "IN_PROGRESS",
  "priority": "CRITICAL",
  "asignatedTo": "senior-tech@example.com"
}
```

**Parámetros URL:**
- `id` (string, requerido) - UUID del ticket

**Parámetros del cuerpo (todos opcionales):**
- `title` (string) - Nuevo título
- `description` (string) - Nueva descripción
- `status` (string) - Nuevo estado: `OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`
- `priority` (string) - Nueva prioridad
- `asignatedTo` (string) - Nuevo encargado

**Respuesta 200:**
```json
{
  "success": true,
  "message": "Ticket actualizado exitosamente",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Error en el sistema de login - URGENTE",
    "status": "IN_PROGRESS",
    "priority": "CRITICAL",
    "updatedAt": "2024-01-15T11:30:00Z"
  }
}
```

**Requerimientos:**
- ✅ Autenticación requerida
- ✅ Rol: TECHNICIAN o ADMIN

---

### 5. Eliminar ticket
Elimina un ticket completamente.

```http
DELETE /api/tickets/delete/:id
Authorization: Bearer <token>
```

**Parámetros URL:**
- `id` (string, requerido) - UUID del ticket

**Respuesta 200:**
```json
{
  "success": true,
  "message": "Ticket eliminado exitosamente"
}
```

**Requerimientos:**
- ✅ Autenticación requerida
- ✅ Rol: TECHNICIAN o ADMIN

**Errores:**
- `404` - Ticket no encontrado
- `403` - Permisos insuficientes

---

## 💬 Comentarios (`/api/comment`)

### 1. Obtener todos los comentarios
Obtiene todos los comentarios del sistema.

```http
GET /api/comment
Authorization: Bearer <token>
```

**Respuesta 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "660e8500-f29b-41d4-a716-446655440000",
      "content": "He revisado el problema y estoy investigando",
      "createdAt": "2024-01-15T10:45:00Z",
      "updatedAt": "2024-01-15T10:45:00Z",
      "ticketId": "550e8400-e29b-41d4-a716-446655440000",
      "userId": 2
    }
  ]
}
```

**Requerimientos:**
- ✅ Autenticación requerida
- ✅ Rol: TECHNICIAN o ADMIN

---

### 2. Crear comentario
Crea un nuevo comentario en un ticket.

```http
POST /api/comment/created/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "ticketId": "550e8400-e29b-41d4-a716-446655440000",
  "content": "He revisado el problema y estoy investigando"
}
```

**Parámetros URL:**
- `id` (string, requerido) - ID del ticket

**Parámetros:**
- `ticketId` (string, requerido) - UUID del ticket
- `content` (string, requerido) - Contenido del comentario (máx 2000 caracteres)

**Respuesta 201:**
```json
{
  "success": true,
  "message": "Comentario creado exitosamente",
  "data": {
    "id": "660e8500-f29b-41d4-a716-446655440000",
    "content": "He revisado el problema y estoy investigando",
    "ticketId": "550e8400-e29b-41d4-a716-446655440000",
    "userId": 1,
    "createdAt": "2024-01-15T10:45:00Z",
    "updatedAt": "2024-01-15T10:45:00Z"
  }
}
```

**Requerimientos:**
- ✅ Autenticación requerida
- ✅ Rol: USER, TECHNICIAN, o ADMIN

---

### 3. Actualizar comentario
Actualiza un comentario existente.

```http
PUT /api/comment/edit/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "He encontrado la causa del problema y estoy trabajando en la solución"
}
```

**Parámetros URL:**
- `id` (string, requerido) - UUID del comentario

**Parámetros:**
- `content` (string, requerido) - Nuevo contenido

**Respuesta 200:**
```json
{
  "success": true,
  "message": "Comentario actualizado exitosamente",
  "data": {
    "id": "660e8500-f29b-41d4-a716-446655440000",
    "content": "He encontrado la causa del problema y estoy trabajando en la solución",
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

**Requerimientos:**
- ✅ Autenticación requerida
- ✅ Propietario del comentario o ADMIN

---

### 4. Eliminar comentario
Elimina un comentario específico.

```http
DELETE /api/comment/:id
Authorization: Bearer <token>
```

**Parámetros URL:**
- `id` (string, requerido) - UUID del comentario

**Respuesta 200:**
```json
{
  "success": true,
  "message": "Comentario eliminado exitosamente"
}
```

**Requerimientos:**
- ✅ Autenticación requerida
- ✅ Propietario del comentario o ADMIN

**Errores:**
- `404` - Comentario no encontrado
- `403` - Permisos insuficientes

---

## 🔑 Códigos de Estado HTTP

| Código | Significado |
|--------|-------------|
| `200` | OK - Solicitud exitosa |
| `201` | Created - Recurso creado exitosamente |
| `400` | Bad Request - Datos inválidos |
| `401` | Unauthorized - Token inválido o expirado |
| `403` | Forbidden - Permisos insuficientes |
| `404` | Not Found - Recurso no encontrado |
| `500` | Internal Server Error - Error del servidor |

---

## 📊 Estructura de Respuestas

### Respuesta exitosa
```json
{
  "success": true,
  "message": "Descripción opcional",
  "data": { /* contenido */ }
}
```

### Respuesta de error
```json
{
  "success": false,
  "message": "Descripción del error",
  "status": 400
}
```

---

## 🔐 Autenticación Bearer

Todas las rutas protegidas requieren un header `Authorization`:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Reemplaza `eyJhbGc...` con el token real obtenido del login/registro.

---

**Última actualización:** 2024-01-15
