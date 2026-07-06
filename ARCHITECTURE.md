# 🏗️ Arquitectura del Proyecto

Documentación de la arquitectura, patrones y flujos de la aplicación Ticket Management API.

---

## 📋 Tabla de Contenidos

- [Visión General](#visión-general)
- [Stack Tecnológico](#stack-tecnológico)
- [Arquitectura en Capas](#arquitectura-en-capas)
- [Patrones de Diseño](#patrones-de-diseño)
- [Flujos de Datos](#flujos-de-datos)
- [Modelos de Datos](#modelos-de-datos)
- [Seguridad](#seguridad)
- [Escalabilidad](#escalabilidad)

---

## 🎯 Visión General

Ticket Management API es una aplicación **REST** construida con una **arquitectura en capas** que implementa:

- ✅ **MVC mejorado** - Separación clara de responsabilidades
- ✅ **Inyección de dependencias** - Código testeable y mantenible
- ✅ **Patrones Repository** - Abstracción de datos
- ✅ **Service Layer** - Lógica de negocio centralizada
- ✅ **Middleware-based** - Procesamiento de solicitudes en cadena

```
Cliente HTTP
    ↓
[Helmet] → [CORS] → [Morgan] → [Error Handler]
    ↓
Express Router
    ↓
Middleware (Auth, Roles)
    ↓
Controller
    ↓
Service
    ↓
Repository
    ↓
Prisma ORM
    ↓
PostgreSQL
```

---

## 🔧 Stack Tecnológico

### Backend
```
Node.js v18+
  └─ Express 5.2 (Framework HTTP)
     ├─ Helmet (Seguridad)
     ├─ Morgan (Logging)
     ├─ CORS (Solicitudes cruzadas)
     ├─ jsonwebtoken (Autenticación)
     └─ bcryptjs (Hash de contraseñas)
```

### Base de Datos
```
PostgreSQL 12+
  └─ Prisma 6.19 (ORM)
     ├─ Query builder type-safe
     ├─ Migraciones automáticas
     └─ Introspección de esquema
```

### Validación
```
Zod 4.4
  ├─ Runtime validation
  ├─ Type inference
  └─ Schemas reutilizables
```

### Herramientas
```
TypeScript 5.9 (Tipado estático)
ts-node-dev (Hot reload)
```

---

## 📊 Arquitectura en Capas

### 1. **Presentation Layer (Controladores)**

**Responsabilidad:** Manejar solicitudes HTTP y respuestas

```typescript
// src/modules/auth/AuthController.ts
export class AuthController {
  constructor(private authService: AuthService) {}

  async registerUser(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. Validar entrada con Zod
      const body = registerSchema.parse(req.body);
      
      // 2. Delegar a servicio
      const result = await this.authService.register(body);
      
      // 3. Formatear respuesta
      res.status(201).json({
        success: true,
        message: 'Usuario registrado',
        data: result
      });
    } catch (error) {
      next(error); // Pasar a middleware de error
    }
  }
}
```

**Responsabilidades:**
- ✅ Validar entrada (con Zod schemas)
- ✅ Llamar al service correspondiente
- ✅ Formatear respuesta
- ✅ Pasar errores al handler

---

### 2. **Service Layer (Lógica de Negocio)**

**Responsabilidad:** Implementar reglas de negocio

```typescript
// src/modules/auth/AuthService.ts
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private jwtHelper: JwtHelper
  ) {}

  async register(dto: RegisterDTO): Promise<AuthResponse> {
    // Validar reglas de negocio
    const existingUser = await this.authRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new AppError('Email duplicado', 400);
    }

    // Procesar datos
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.authRepository.create({
      ...dto,
      password: hashedPassword
    });

    // Generar tokens
    const accessToken = this.jwtHelper.generateToken(user);

    return {
      accessToken,
      user: this.mapToDTO(user)
    };
  }

  private mapToDTO(user: User): UserDTO {
    // Mapear modelo a DTO (excluir password)
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };
  }
}
```

**Responsabilidades:**
- ✅ Implementar lógica de negocio
- ✅ Validar reglas
- ✅ Coordinar con repositorios
- ✅ Lanzar excepciones de negocio
- ✅ Mapear modelos a DTOs

---

### 3. **Repository Layer (Acceso a Datos)**

**Responsabilidad:** Abstracción de la base de datos

```typescript
// src/modules/auth/AuthRepository.ts
export class AuthRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateUserInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email }
    });
  }

  async update(id: number, data: UpdateUserInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.user.delete({
      where: { id }
    });
  }
}
```

**Responsabilidades:**
- ✅ Operaciones CRUD
- ✅ Queries complejas
- ✅ Transacciones
- ✅ Índices y optimización

---

### 4. **Data Layer (Base de Datos)**

```
PostgreSQL Database
├── Users
├── Tickets
├── Comments
└── Indices & Constraints
```

---

## 🎨 Patrones de Diseño

### 1. **Dependency Injection**

```typescript
// Inyectar dependencias a través del constructor
export class CommentsController {
  constructor(private commentsService: CommentsService) {}
  
  // El servicio es inyectado, no creado internamente
}

export class CommentsService {
  constructor(private commentsRepository: CommentsRepository) {}
}
```

**Beneficios:**
- ✅ Fácil de testear (mockear dependencias)
- ✅ Bajo acoplamiento
- ✅ Código mantenible
- ✅ Reutilizable

---

### 2. **Repository Pattern**

```typescript
// Abstracción de datos
interface IUserRepository {
  create(data: CreateUserDTO): Promise<User>;
  findById(id: number): Promise<User | null>;
  update(id: number, data: UpdateUserDTO): Promise<User>;
  delete(id: number): Promise<void>;
}

// Implementación
class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}
  // ... implementar métodos
}
```

**Ventajas:**
- ✅ Cambiar BD sin afectar servicios
- ✅ Queries centralizadas
- ✅ Caché fácil de implementar
- ✅ Testeable

---

### 3. **DTO (Data Transfer Object)**

```typescript
// DTO para crear usuario
export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}

// DTO de respuesta (sin password)
export type UserResponseDTO = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
};
```

**Razones:**
- ✅ Validación de entrada
- ✅ Seguridad (no exponer datos internos)
- ✅ Documentación clara
- ✅ Evolución de API sin cambios internos

---

### 4. **Error Handling Centralizado**

```typescript
// src/helpers/AppError.ts
export class AppError extends Error {
  constructor(
    public message: string,
    public status: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// En controllers
throw new AppError('Usuario no encontrado', 404);

// Middleware centralizado
app.use(errorHandler);
```

---

## 🔄 Flujos de Datos

### Flujo de Autenticación (Register)

```
POST /api/auth/register
    ↓
[ValidarSchema] → Zod
    ↓
AuthController.registerUser()
    ├─ Validar entrada ✓
    ├─ Llamar AuthService ↓
    │
    AuthService.register()
    ├─ Verificar email duplicado
    ├─ Hash contraseña
    ├─ Llamar Repository ↓
    │
    AuthRepository.create()
    ├─ Insertar en DB ↓
    │
    PostgreSQL (CREATE)
    │
    ├─ Retornar User ↑
    │
    ├─ Generar JWT
    ├─ Mapear a DTO
    ├─ Retornar Response ↑
    │
[Formatear HTTP 201]
    ↓
HTTP Response
```

### Flujo de Obtención de Tickets

```
GET /api/tickets
    ↓
[verifyToken] → JWT
    ↓
[verifyRole(TECHNICIAN, ADMIN)] → Roles
    ↓
TicketController.getAllTickets()
    ├─ Llamar TicketService ↓
    │
    TicketService.getAllTickets()
    ├─ Llamar Repository ↓
    │
    TicketRepository.findAll()
    ├─ Query Prisma ↓
    │
    PostgreSQL (SELECT * FROM tickets)
    │
    ├─ Retornar Tickets[] ↑
    │
    ├─ Mapear a DTOs
    ├─ Retornar Response ↑
    │
[Formatear HTTP 200]
    ↓
HTTP Response (JSON array)
```

---

## 📊 Modelos de Datos

### Diagrama de Entidades

```
┌─────────────┐
│   USER      │
├─────────────┤
│ id (PK)     │◄──────┐
│ name        │       │
│ email       │       │
│ password    │       │ 1:N
│ role        │       │
│ createdAt   │       │
└─────────────┘       │
                      │
                ┌─────────────────┐
                │    TICKET       │
                ├─────────────────┤
                │ id (PK)         │◄──────┐
                │ title           │       │
                │ description     │       │ 1:N
                │ status          │       │
                │ priority        │       │
                │ userId (FK)     │───────┼──────────┐
                │ assignedTo      │       │          │
                │ createdAt       │       │          │
                └─────────────────┘       │          │
                      │                  │          │
                      │ 1:N              │          │
                      │                  │          │
                ┌─────────────────┐      │          │
                │   COMMENT       │      │          │
                ├─────────────────┤      │          │
                │ id (PK)         │      │          │
                │ content         │      │          │
                │ ticketId (FK)   │──────┘          │
                │ userId (FK)     │─────────────────┘
                │ createdAt       │
                └─────────────────┘
```

### Relaciones

| Relación | Tipo | Descripción |
|----------|------|-------------|
| User → Tickets | 1:N | Un usuario puede crear múltiples tickets |
| User → Comments | 1:N | Un usuario puede hacer múltiples comentarios |
| Ticket → Comments | 1:N | Un ticket puede tener múltiples comentarios |

### Enums

```typescript
enum UserRole {
  USER       // Usuario estándar
  TECHNICIAN // Técnico de soporte
  ADMIN      // Administrador
}

enum TicketStatus {
  OPEN       // Abierto
  IN_PROGRESS // En progreso
  RESOLVED   // Resuelto
  CLOSED     // Cerrado
}

enum TicketPriority {
  LOW        // Baja
  MEDIUM     // Media
  HIGH       // Alta
  CRITICAL   // Crítica
}
```

---

## 🔐 Seguridad

### Autenticación

```typescript
// JWT Strategy
1. Usuario proporciona credenciales
2. Validar email + password
3. Generar JWT (acceso + refresh)
4. Cliente incluye token en headers
5. Middleware verifica JWT
6. Ejecutar endpoint protegido
```

**Flujo detallado:**

```typescript
// Middleware verifyToken
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    throw new AppError('Token no proporcionado', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    throw new AppError('Token inválido', 401);
  }
};
```

### Autorización

```typescript
// Middleware verifyRole
export const verifyRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError('No autenticado', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError('Permisos insuficientes', 403);
    }

    next();
  };
};
```

### Contraseñas

```typescript
// Hashing con bcryptjs
const hashedPassword = await bcrypt.hash(password, 10);

// Validación
const isValid = await bcrypt.compare(password, hashedPassword);
```

---

## 📈 Escalabilidad

### Optimizaciones Actuales

1. **Indices de BD**
   ```sql
   CREATE INDEX idx_user_email ON users(email);
   CREATE INDEX idx_ticket_userId ON tickets(userId);
   CREATE INDEX idx_comment_ticketId ON comments(ticketId);
   ```

2. **Caché (Implementable)**
   ```typescript
   // Agregar Redis
   const cachedTicket = await redis.get(`ticket:${id}`);
   if (!cachedTicket) {
     const ticket = await repository.findById(id);
     await redis.set(`ticket:${id}`, JSON.stringify(ticket));
   }
   ```

3. **Paginación**
   ```typescript
   async getAllTickets(page: number = 1, limit: number = 20) {
     return this.prisma.ticket.findMany({
       skip: (page - 1) * limit,
       take: limit
     });
   }
   ```

### Mejoras Futuras

- [ ] Implementar caché con Redis
- [ ] Paginación en todos los endpoints
- [ ] Búsqueda full-text con Elasticsearch
- [ ] Colas de trabajos con Bull
- [ ] GraphQL como alternativa a REST
- [ ] Microservicios para funcionalidades complejas
- [ ] CQRS para lectura/escritura separadas

---

## 🔄 Flujo de Solicitud Completo

```
1. REQUEST
   HTTP GET /api/tickets
   Header: Authorization: Bearer <jwt>

2. MIDDLEWARE
   ├─ express.json()
   ├─ morgan (log)
   ├─ helmet (seguridad)
   └─ verifyToken (autenticación)

3. ROUTING
   ticketRouter.get('/', ...)

4. CONTROLLER
   TicketController.getAllTickets()
   ├─ Validar entrada
   ├─ Llamar servicio

5. SERVICE
   TicketService.getAllTickets()
   ├─ Aplicar reglas de negocio
   ├─ Llamar repositorio

6. REPOSITORY
   TicketRepository.findAll()
   ├─ Construir query Prisma
   ├─ Ejecutar en BD

7. DATABASE
   PostgreSQL
   ├─ Procesar query
   ├─ Retornar datos

8. RESPONSE BUILDING
   ├─ Repository → Datos
   ├─ Service → Mapeo a DTO
   ├─ Controller → HTTP 200
   ├─ Formatear JSON

9. HTTP RESPONSE
   {
     "success": true,
     "data": [...]
   }

10. CLIENT
    Recibe respuesta JSON
```

---

## 📚 Recursos Adicionales

- [Documentación de Prisma](https://www.prisma.io/docs/)
- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)

---

**Última actualización:** 2024-01-15
