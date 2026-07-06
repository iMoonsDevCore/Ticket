# 🚀 Guía de Despliegue

Guía completa para desplegar Ticket Management API en diferentes plataformas.

---

## 📋 Tabla de Contenidos

- [Checklist de Pre-despliegue](#checklist-de-pre-despliegue)
- [Despliegue en Railway](#despliegue-en-railway)
- [Despliegue en Heroku](#despliegue-en-heroku)
- [Despliegue en Docker](#despliegue-en-docker)
- [Despliegue en AWS](#despliegue-en-aws)
- [Monitoreo y Mantenimiento](#monitoreo-y-mantenimiento)

---

## ✅ Checklist de Pre-despliegue

Antes de desplegar, verifica:

- [ ] Variables de entorno configuradas correctamente
- [ ] Base de datos funcionando en producción
- [ ] Migraciones ejecutadas
- [ ] Código testado localmente
- [ ] Dependencias actualizadas
- [ ] Secrets seguros (JWT_SECRET con 32+ caracteres)
- [ ] CORS configurado correctamente
- [ ] SSL/HTTPS configurado
- [ ] Logs habilitados
- [ ] Backups de BD configurados

---

## 🚀 Despliegue en Railway

### Paso 1: Preparar el repositorio

```bash
# Asegurate que .env está en .gitignore
echo ".env" >> .gitignore

# Commit cambios
git add .
git commit -m "Preparar para despliegue en Railway"
git push origin main
```

### Paso 2: Crear proyecto en Railway

1. Accede a [railway.app](https://railway.app)
2. Haz login o crea una cuenta
3. Haz click en "New Project"
4. Selecciona "Deploy from GitHub"
5. Conecta tu repositorio

### Paso 3: Configurar variables de entorno

En el dashboard de Railway:

1. Ve a "Variables"
2. Agrega las siguientes variables:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://...
JWT_SECRET=tu_secreto_muy_seguro_32_caracteres_minimo
JWT_REFRESH_SECRET=tu_secreto_refresh_muy_seguro_32_caracteres
```

### Paso 4: Configurar base de datos

1. En Railway, agrega un plugin PostgreSQL
2. Copia la `DATABASE_URL` generada
3. Pégala en las variables de entorno

### Paso 5: Deploy

```bash
# Railway despliega automáticamente con cada push
git push origin main

# O manualmente en el dashboard
# Click "Deploy" en tu proyecto
```

**URL del proyecto:**
```
https://tuproyecto-production.up.railway.app
```

---

## 🚀 Despliegue en Heroku

### Paso 1: Instalar Heroku CLI

```bash
# Windows
choco install heroku-cli

# macOS
brew tap heroku/brew && brew install heroku

# Linux
curl https://cli-assets.heroku.com/install.sh | sh
```

### Paso 2: Login en Heroku

```bash
heroku login
```

### Paso 3: Crear aplicación

```bash
heroku create nombre-de-tu-app
```

### Paso 4: Agregar base de datos

```bash
# Agregar PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Ver la URL
heroku config:get DATABASE_URL
```

### Paso 5: Configurar variables

```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET="tu_secreto_muy_seguro"
heroku config:set JWT_REFRESH_SECRET="tu_refresh_secreto"
heroku config:set PORT=5000
```

### Paso 6: Deploy

```bash
# Desplegar desde tu rama actual
git push heroku main

# Si usas otra rama
git push heroku tu-rama:main

# Ver logs
heroku logs --tail
```

### Paso 7: Ejecutar migraciones

```bash
heroku run npx prisma migrate deploy
```

**URL de la aplicación:**
```
https://nombre-de-tu-app.herokuapp.com
```

---

## 🐳 Despliegue en Docker

### Paso 1: Crear Dockerfile

```dockerfile
# Use official Node runtime as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

### Paso 2: Crear docker-compose.yml

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://user:password@postgres:5432/ticket_db
      JWT_SECRET: ${JWT_SECRET}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
    depends_on:
      - postgres
    networks:
      - ticket-network

  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: ticket_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - ticket-network

networks:
  ticket-network:
    driver: bridge

volumes:
  postgres_data:
```

### Paso 3: Build y ejecutar

```bash
# Build imagen
docker build -t ticket-api .

# Ejecutar con docker-compose
docker-compose up -d

# Ver logs
docker-compose logs -f api

# Parar servicios
docker-compose down
```

---

## ☁️ Despliegue en AWS

### Opción 1: EC2

#### Paso 1: Crear instancia EC2

1. Abre AWS Console
2. EC2 → Instances → Launch Instance
3. Elige Ubuntu 20.04 LTS
4. Tipo: t2.micro (free tier)
5. Configure security group:
   - SSH (22) desde tu IP
   - HTTP (80)
   - HTTPS (443)

#### Paso 2: Conectar y actualizar

```bash
# SSH a la instancia
ssh -i tu-clave.pem ubuntu@tu-ip-publica

# Actualizar paquetes
sudo apt update && sudo apt upgrade -y

# Instalar Node
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Instalar PM2 (gestor de procesos)
sudo npm install -g pm2
```

#### Paso 3: Clonar y desplegar

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/ticket-api.git
cd ticket-api

# Instalar dependencias
npm install

# Crear .env
nano .env
# (Agregar variables de entorno)

# Ejecutar migraciones
npx prisma migrate deploy

# Iniciar con PM2
pm2 start "npm start" --name "ticket-api"
pm2 startup
pm2 save

# Ver logs
pm2 logs ticket-api
```

#### Paso 4: Configurar Nginx (reverse proxy)

```bash
# Instalar Nginx
sudo apt install -y nginx

# Crear configuración
sudo nano /etc/nginx/sites-available/ticket-api
```

```nginx
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Habilitar sitio
sudo ln -s /etc/nginx/sites-available/ticket-api /etc/nginx/sites-enabled/

# Reiniciar Nginx
sudo systemctl restart nginx
```

---

### Opción 2: RDS (Base de datos manejada)

```bash
# En AWS Console:
# 1. RDS → Create Database
# 2. PostgreSQL engine
# 3. Free tier template
# 4. Set master username/password
# 5. Copy endpoint

# En .env:
DATABASE_URL=postgresql://admin:password@endpoint:5432/ticket_db
```

---

## 📊 Monitoreo y Mantenimiento

### Monitoreo de errores

```typescript
// Agregar a app.ts
import Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

app.use(Sentry.Handlers.errorHandler());
```

### Logs centralizados

```bash
# Instalar LogRocket o similar
npm install logrocket

# Ver logs en el dashboard del proveedor
```

### Backups automáticos

#### Railway/Heroku
- ✅ Automático (revisa la documentación)

#### AWS RDS
```bash
# Backup automático habilitado en consola
# Retención: 7 días (configurable)
# Copias: Manual en AWS Console
```

#### Docker
```bash
# Backup de BD PostgreSQL
docker exec postgres-container pg_dump -U user ticket_db > backup.sql

# Restaurar
docker exec -i postgres-container psql -U user ticket_db < backup.sql
```

### Monitoreo de performance

```bash
# Instalar New Relic
npm install newrelic

# Crear newrelic.js
# Ver documentación oficial
```

### Health checks

```typescript
// Agregar a app.ts
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

```bash
# Configurar health check en tu proveedor
# Railway/Heroku: Auto-detectado en /health
```

---

## 🔐 Seguridad en Producción

```env
# .env producción
NODE_ENV=production
PORT=3000

# JWT con suficiente entropía
JWT_SECRET=generar_con_crypto_32_caracteres_minimo
JWT_REFRESH_SECRET=generar_con_crypto_32_caracteres_minimo

# CORS restringido
CORS_ORIGIN=https://tudominio.com

# Base de datos
DATABASE_URL=postgresql://user:password@host:5432/db

# Sentry (error tracking)
SENTRY_DSN=https://...

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Checklist de seguridad

- [ ] HTTPS habilitado
- [ ] JWT_SECRET de 32+ caracteres aleatorios
- [ ] CORS configurado correctamente
- [ ] Rate limiting activado
- [ ] Helmet habilitado
- [ ] Headers de seguridad configurados
- [ ] Logging sin datos sensibles
- [ ] Backups regulares
- [ ] Monitoreo de errores
- [ ] Actualización regular de dependencias

---

## 🆘 Solución de Problemas

### Aplicación no inicia

```bash
# Revisar logs
heroku logs --tail
# o
pm2 logs

# Verificar variables de entorno
heroku config
# o
echo $DATABASE_URL
```

### Error de conexión a BD

```bash
# Verificar BD está disponible
psql $DATABASE_URL

# Ejecutar migraciones nuevamente
npx prisma migrate deploy

# Ver estado de BD
npx prisma studio
```

### Port ya está en uso

```bash
# Cambiar puerto en .env
PORT=3001

# O matar proceso
lsof -i :3000
kill -9 <PID>
```

---

## 📚 Recursos

- [Railway Docs](https://docs.railway.app)
- [Heroku Docs](https://devcenter.heroku.com)
- [Docker Docs](https://docs.docker.com)
- [AWS Docs](https://docs.aws.amazon.com)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)

---

**Última actualización:** 2024-01-15
