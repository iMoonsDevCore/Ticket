# 🆘 Guía de Solución de Problemas

Soluciones rápidas para problemas comunes durante el desarrollo y despliegue.

---

## 📋 Tabla de Contenidos

- [Problemas de Base de Datos](#problemas-de-base-de-datos)
- [Problemas de Autenticación](#problemas-de-autenticación)
- [Problemas de Desarrollo](#problemas-de-desarrollo)
- [Problemas de Despliegue](#problemas-de-despliegue)
- [Errores Comunes](#errores-comunes)

---

## 🗄️ Problemas de Base de Datos

### Error: "Can't reach database server"

**Síntoma:**
```
Error: P1000
Can't reach database server at `host:5432`
```

**Soluciones:**

```bash
# 1. Verificar que PostgreSQL está corriendo
pg_isready -h localhost -p 5432

# 2. Verificar DATABASE_URL en .env
echo $DATABASE_URL

# 3. Probar conexión directa
psql postgresql://user:password@localhost:5432/ticket_db

# 4. Reiniciar PostgreSQL
# Windows: Services → PostgreSQL → Restart
# macOS: brew services restart postgresql
# Linux: sudo systemctl restart postgresql

# 5. Si aún no funciona, reset de Prisma
npx prisma migrate reset
```

---

### Error: "database "ticket_db" does not exist"

**Solución:**

```bash
# Crear la base de datos
createdb ticket_db

# O inicializar con Prisma
npx prisma migrate dev --name init
```

---

### Error: "role "postgres" does not exist"

**Solución:**

```bash
# Crear rol
createuser -d -P postgres

# O resetear completamente
dropdb ticket_db
createdb ticket_db
npx prisma migrate dev --name init
```

---

### Error: "Unexpected fields in database: ..."

**Síntoma:**
```
Unexpected fields in database: 
  comment
Have these fields already been created in the database manually?
```

**Solución:**

```bash
# Opción 1: Actualizar schema.prisma para coincidir
# Editar prisma/schema.prisma

# Opción 2: Reset limpio
npx prisma migrate reset
npx prisma migrate dev --name init
```

---

## 🔐 Problemas de Autenticación

### Error: "Invalid token"

**Síntoma:**
```
AppError: Token inválido
Status: 401
```

**Soluciones:**

```bash
# 1. Verificar que el token se envía correctamente
# Header debe ser: Authorization: Bearer <token>
# NO: Authorization: <token>

# 2. Verificar JWT_SECRET
echo $JWT_SECRET
# Debe tener 32+ caracteres

# 3. Token expirado, refrescar
curl -X POST http://localhost:3000/api/auth/refresh

# 4. Regenerar token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

---

### Error: "Unauthorized" en endpoints protegidos

**Síntoma:**
```
AppError: Permisos insuficientes
Status: 403
```

**Soluciones:**

```bash
# 1. Verificar rol del usuario
# GET /api/auth/mytoken
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/auth/mytoken

# 2. Verificar que el endpoint requiere el rol correcto
# Revisar CommentsRouter.ts, TicketRouter.ts

# 3. Si es ADMIN/TECHNICIAN, actualizar rol en BD
# Via Prisma Studio
npx prisma studio
# Cambiar user.role a "ADMIN"
```

---

### Error: "JsonWebTokenError"

**Síntoma:**
```
JsonWebTokenError: invalid token
```

**Soluciones:**

```bash
# 1. Token corrupto o modificado
# Generar uno nuevo

# 2. JWT_SECRET diferente entre sign y verify
# Asegurar que JWT_SECRET es el mismo en .env

# 3. Token de otro proyecto
# Usar token de este proyecto
```

---

## 💻 Problemas de Desarrollo

### Error: "Cannot find module '@prisma/client'"

**Solución:**

```bash
# Reinstalar dependencias
npm install

# O generar cliente Prisma
npx prisma generate
```

---

### Error: "EADDRINUSE: address already in use :::3000"

**Síntoma:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Soluciones:**

```bash
# Opción 1: Matar proceso en puerto 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>

# Opción 2: Usar puerto diferente
# En .env cambiar:
PORT=3001
```

---

### Error: "Cannot read property 'user' of undefined"

**Síntoma:**
```
TypeError: Cannot read property 'user' of undefined
```

**Causa:** Middleware `verifyToken` no se ejecutó

**Solución:**

```typescript
// ✅ CORRECTO
ticketRouter.get("/:id",
  verifyToken,  // ← Agregar middleware PRIMERO
  verifyRole(UserRole.TECHNICIAN, UserRole.ADMIN),
  ticketController.getTicketById
)

// ❌ INCORRECTO
ticketRouter.get("/:id",
  ticketController.getTicketById  // Sin verificación
)
```

---

### Error: "ZodError: validation error"

**Síntoma:**
```
ZodError: [
  {
    "code": "too_small",
    "minimum": 1,
    "type": "string",
    "message": "String must contain at least 1 character(s)"
  }
]
```

**Solución:**

```typescript
// Revisar el schema y la entrada
// En CommentSchema.ts
const createCommentSchema = z.object({
  ticketId: z.string().min(1),
  content: z.string().min(1).max(2000)
});

// En request
{
  "ticketId": "550e8400-e29b-41d4-a716-446655440000",  // ✓ No vacío
  "content": "Contenido"  // ✓ No vacío, < 2000 chars
}
```

---

### Error: "Hot reload no funciona"

**Solución:**

```bash
# Reiniciar ts-node-dev
npm run dev

# Matar proceso y reiniciar
Ctrl+C
npm run dev

# Si persiste, limpiar caché
del /s *.js  # Windows
rm -rf **/*.js  # macOS/Linux
npm run dev
```

---

## 🚀 Problemas de Despliegue

### Error: "Build fails on Heroku/Railway"

**Solución:**

```bash
# Ver logs detallados
heroku logs --tail

# Asegurar que package.json tiene "build" script
# En package.json
"scripts": {
  "build": "tsc",
  "start": "node dist/app.js"
}

# Compilar localmente para probar
npm run build
npm start
```

---

### Error: "Cannot find module in production"

**Causa:** Dependencia no instalada

**Solución:**

```bash
# Verificar que está en dependencies (no devDependencies)
npm ls swagger-jsdoc
npm ls @prisma/client

# Reinstalar
npm install

# Hacer deploy de nuevo
git push heroku main
```

---

### Error: "Database migration failed on deploy"

**Solución:**

```bash
# Ver historial de migraciones
heroku run npx prisma migrate status

# Ver logs
heroku logs --tail

# Reset de BD (cuidado, elimina datos)
heroku pg:reset DATABASE

# Re-ejecutar migraciones
heroku run npx prisma migrate deploy
```

---

### Error: "SECRET/TOKEN not defined"

**Solución:**

```bash
# Heroku
heroku config:set JWT_SECRET="tu_secreto_largo_32_caracteres"

# Railway
En Variables → JWT_SECRET

# Docker
En docker-compose.yml o environment
```

---

## 🔥 Errores Comunes

### Error 400: "Invalid email"

**Causa:** Email no válido según Zod

**Solución:**

```bash
# Enviar email válido
{
  "email": "user@example.com",  // ✓ Formato correcto
  "password": "Password123!"
}
```

---

### Error 404: "User not found"

**Causa:** Email no registrado

**Solución:**

```bash
# 1. Registrar primero
POST /api/auth/register

# 2. Usar email correcto
GET /api/auth/mytoken
# Ver email del usuario logueado
```

---

### Error 409: "Email already exists"

**Causa:** Email ya registrado

**Solución:**

```bash
# Usar email diferente
{
  "email": "nuevo-email@example.com"
}

# O login si ya tienes cuenta
POST /api/auth/login
```

---

### Error 500: "Internal Server Error"

**Solución:**

```bash
# Ver logs
npm run dev  # Ver output en terminal

# Verificar
1. DATABASE_URL válido
2. JWT_SECRET configurado
3. Migraciones ejecutadas
4. Node.js versión compatible

# Reinstalar todo
npm install
npx prisma generate
npx prisma migrate dev
```

---

## 🧪 Debugging

### Activar logs detallados

```bash
# Prisma debug
DEBUG=* npm run dev

# Node debug
node --inspect src/app.ts

# Morgan mostrará todas las solicitudes
```

### Usar Prisma Studio

```bash
npx prisma studio
# Abre UI en http://localhost:5555
# Ver y editar datos en tiempo real
```

### Inspeccionar variables

```typescript
// En controllers/services
console.log('User:', req.user);
console.log('Body:', req.body);
console.log('Query:', req.query);
console.log('Params:', req.params);
```

---

## 📞 Soporte

Si el problema persiste:

1. Revisar [documentación oficial](https://docs.prisma.io)
2. Buscar en [Stack Overflow](https://stackoverflow.com/questions/tagged/prisma)
3. Abrir [issue en GitHub](https://github.com/tu-usuario/ticket-api/issues)
4. Contactar a support@ticketapp.com

---

**Última actualización:** 2024-01-15
