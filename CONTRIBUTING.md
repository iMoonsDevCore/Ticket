# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir a Ticket Management API! Esta guía te ayudará a entender cómo contribuir al proyecto.

---

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Cómo Contribuir](#cómo-contribuir)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Mejoras](#sugerir-mejoras)
- [Pull Requests](#pull-requests)
- [Guía de Estilo](#guía-de-estilo)
- [Configuración de Desarrollo](#configuración-de-desarrollo)

---

## 🤝 Código de Conducta

Por favor, sé respetuoso con otros colaboradores. Esperamos:

- ✅ Comunicación clara y constructiva
- ✅ Respeto por diferentes opiniones
- ✅ Enfoque en mejoras del código
- ✅ Ayuda mutua entre contribuidores

---

## 💡 Cómo Contribuir

Hay varias formas de contribuir:

1. **Reportar bugs** - Ayuda identificando problemas
2. **Sugerir mejoras** - Propón nuevas características
3. **Escribir código** - Implementa fixes o features
4. **Mejorar documentación** - Corrige o expande docs
5. **Ayudar en issues** - Responde preguntas de otros

---

## 🐛 Reportar Bugs

### Antes de reportar

- Busca en issues existentes para evitar duplicados
- Verifica que no sea un problema de configuración local
- Intenta reproducir el bug en la rama `main`

### Cómo reportar

Abre un issue con la siguiente información:

```markdown
**Descripción del bug**
[Descripción clara de qué está mal]

**Cómo reproducir**
1. Paso 1
2. Paso 2
3. ...

**Comportamiento esperado**
[Qué debería suceder]

**Comportamiento actual**
[Qué sucede realmente]

**Entorno**
- Node.js version: [ej. 18.0.0]
- npm version: [ej. 8.0.0]
- OS: [ej. Windows 10]
- Base de datos: [ej. PostgreSQL 13]

**Logs/Errores**
[Pega cualquier mensaje de error relevante]

**Screenshots**
[Adjunta capturas si es relevante]
```

---

## 💬 Sugerir Mejoras

### Estructura de la sugerencia

```markdown
**Descripción de la mejora**
[Descripción clara de qué quieres mejorar]

**¿Por qué es útil?**
[Explica el beneficio]

**Solución propuesta**
[Describe tu idea]

**Alternativas consideradas**
[Otros enfoques que pensaste]

**Contexto adicional**
[Información relevante]
```

---

## 🔀 Pull Requests

### Antes de empezar

1. Fork el repositorio
2. Crea una rama desde `main`:
   ```bash
   git checkout -b feature/descripcion-clara
   ```

### Mientras trabajas

1. **Commits claros**
   ```bash
   git commit -m "feat: agregar validación de email"
   ```
   
   Usa prefijos:
   - `feat:` - Nueva característica
   - `fix:` - Corrección de bug
   - `docs:` - Documentación
   - `style:` - Formato de código
   - `refactor:` - Reorganización de código
   - `test:` - Tests
   - `chore:` - Cambios de build/deps

2. **Prueba tu código**
   ```bash
   npm run dev
   # Prueba manualmente o escribe tests
   ```

3. **Mantén tu rama actualizada**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

### Creando el PR

1. Push a tu fork:
   ```bash
   git push origin feature/descripcion-clara
   ```

2. Abre un Pull Request con:
   - Título descriptivo
   - Descripción de cambios
   - Referencia a issues relacionados (#123)
   - Screenshot si es UI

3. Responde a comentarios de reviews
4. Mantén el PR actualizado con main

### Template de PR

```markdown
## 📝 Descripción
[Breve descripción de los cambios]

## 🔗 Issues relacionados
Closes #123

## 🧪 Cómo probar
1. Paso 1
2. Paso 2

## ✅ Checklist
- [ ] Mi código sigue el estilo del proyecto
- [ ] He probado los cambios
- [ ] He actualizado la documentación
- [ ] No hay breaking changes
- [ ] Los logs son claros

## 📸 Screenshots (si aplica)
[Adjunta imágenes]
```

---

## 📐 Guía de Estilo

### TypeScript

```typescript
// ✅ BIEN
function getUserById(id: number): Promise<User> {
  return db.user.findUnique({ where: { id } });
}

const user: User = {
  id: 1,
  email: 'user@example.com',
};

// ❌ MAL
function getUser(id) {
  return db.user.findUnique({ where: { id } });
}

const user = { id: 1, email: 'user@example.com' };
```

### Archivo de módulo

Estructura recomendada:
```
modulo/
├── ModuleController.ts    # Controlador
├── ModuleService.ts       # Lógica de negocio
├── ModuleRepository.ts    # Acceso a datos
├── ModuleRouter.ts        # Rutas
├── module.interface.ts    # Tipos
├── dto/
│   └── ModuleDTO.ts      # Data Transfer Objects
└── schemas/
    ├── ModuleSchema.ts
    └── UpdateModuleSchema.ts
```

### Nombres

```typescript
// ✅ Claro y descriptivo
function validateUserEmail(email: string): boolean {}

const userRepository = new UserRepository(prisma);

interface IUserService {
  getUserById(id: number): Promise<User>;
}

// ❌ Ambiguo
function check(email) {}

const repo = new UserRepository(prisma);

interface UserService {
  get(id) {}
}
```

### Comentarios

```typescript
// ✅ Comentarios útiles
// Validar que el email no esté registrado antes de crear
const existingUser = await userRepository.findByEmail(email);

// ❌ Comentarios obvios
// Obtener el usuario
const user = await userRepository.getUserById(id);
```

### Manejo de errores

```typescript
// ✅ BIEN
try {
  const user = await userService.getUserById(id);
  if (!user) {
    throw new AppError('Usuario no encontrado', 404);
  }
  return res.json({ success: true, data: user });
} catch (error) {
  next(error);
}

// ❌ MAL
try {
  const user = await userRepository.getUserById(id);
  return res.json(user);
} catch (error) {
  res.status(500).json({ error: 'Error' });
}
```

---

## 🛠️ Configuración de Desarrollo

### Requisitos
- Node.js 16+
- PostgreSQL 12+
- Git

### Setup

```bash
# 1. Fork y clonar
git clone https://github.com/tu-usuario/ticket-api.git
cd ticket-api

# 2. Instalar dependencias
npm install

# 3. Configurar .env
cp .env.example .env
# Editar .env con tus credenciales

# 4. Migraciones de BD
npx prisma migrate dev

# 5. Iniciar en modo desarrollo
npm run dev
```

### Comandos útiles

```bash
# Desarrollo
npm run dev              # Servidor con hot reload

# Base de datos
npx prisma studio       # UI para ver/editar datos
npx prisma migrate dev  # Crear migraciones

# Documentación
# Accede a http://localhost:3000/api-docs
```

### Estructura de archivos importantes

```
src/
├── modules/            # Módulos funcionales
├── config/            # Configuraciones
├── middlewares/       # Middlewares
├── helpers/           # Utilidades
└── types/             # Tipos globales
```

---

## 📚 Recursos

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Express.js Docs](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Zod Validation](https://zod.dev/)

---

## ❓ Preguntas

- 💬 Abre una discussion en el repositorio
- 📧 Contacta a support@ticketapp.com

---

## 🙏 Agradecimientos

¡Gracias por contribuir! Tu ayuda es valiosa para mejorar este proyecto.

**Happy Coding!** 🚀
