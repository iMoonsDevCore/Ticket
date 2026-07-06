import { Router, Request, Response } from "express";

const docsRouter = Router();

/**
 * @swagger
 * /docs:
 *   get:
 *     summary: Landing page de documentación
 *     description: Página principal de documentación con links a recursos
 *     tags:
 *       - Documentation
 *     responses:
 *       200:
 *         description: Página de documentación
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
docsRouter.get("/", (req: Request, res: Response) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Documentación - Ticket Management API</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
                    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
                    sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                padding: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .container {
                background: white;
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                max-width: 900px;
                width: 100%;
                padding: 50px;
            }
            
            .header {
                text-align: center;
                margin-bottom: 50px;
            }
            
            .logo {
                font-size: 48px;
                margin-bottom: 20px;
            }
            
            h1 {
                color: #333;
                font-size: 2.5em;
                margin-bottom: 10px;
            }
            
            .subtitle {
                color: #666;
                font-size: 1.1em;
                margin-bottom: 30px;
            }
            
            .version {
                display: inline-block;
                background: #667eea;
                color: white;
                padding: 5px 15px;
                border-radius: 20px;
                font-size: 0.9em;
            }
            
            .docs-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 25px;
                margin-bottom: 40px;
            }
            
            .doc-card {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                border-radius: 8px;
                text-decoration: none;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                cursor: pointer;
            }
            
            .doc-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
            }
            
            .doc-card h3 {
                font-size: 1.3em;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .doc-card p {
                font-size: 0.95em;
                opacity: 0.9;
                line-height: 1.5;
            }
            
            .doc-icon {
                font-size: 1.5em;
            }
            
            .info-section {
                background: #f5f5f5;
                padding: 30px;
                border-radius: 8px;
                margin-bottom: 30px;
            }
            
            .info-section h2 {
                color: #333;
                margin-bottom: 15px;
                font-size: 1.3em;
            }
            
            .info-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
            }
            
            .info-item {
                background: white;
                padding: 15px;
                border-radius: 6px;
                border-left: 4px solid #667eea;
            }
            
            .info-item strong {
                display: block;
                color: #667eea;
                margin-bottom: 5px;
            }
            
            .info-item p {
                color: #666;
                font-size: 0.95em;
            }
            
            .footer {
                text-align: center;
                padding-top: 20px;
                border-top: 1px solid #eee;
                color: #999;
                font-size: 0.9em;
            }
            
            .endpoints-summary {
                background: #f0f4ff;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                border-left: 4px solid #667eea;
            }
            
            .endpoints-summary h3 {
                color: #667eea;
                margin-bottom: 15px;
            }
            
            .endpoint-list {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 10px;
            }
            
            .endpoint-item {
                background: white;
                padding: 10px;
                border-radius: 4px;
                font-size: 0.85em;
                text-align: center;
                border: 1px solid #ddd;
            }
            
            .method {
                display: inline-block;
                padding: 3px 8px;
                border-radius: 3px;
                font-weight: bold;
                margin-right: 5px;
                font-size: 0.75em;
            }
            
            .method.get {
                background: #61affe;
                color: white;
            }
            
            .method.post {
                background: #49cc90;
                color: white;
            }
            
            .method.put {
                background: #fca130;
                color: white;
            }
            
            .method.delete {
                background: #f93e3e;
                color: white;
            }
            
            @media (max-width: 768px) {
                .container {
                    padding: 30px 20px;
                }
                
                h1 {
                    font-size: 1.8em;
                }
                
                .docs-grid {
                    grid-template-columns: 1fr;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🎫</div>
                <h1>Ticket Management API</h1>
                <p class="subtitle">Sistema de gestión de tickets con soporte para comentarios</p>
                <span class="version">v1.0.0</span>
            </div>
            
            <div class="info-section">
                <h2>📚 Documentación</h2>
                <div class="docs-grid">
                    <a href="/api-docs" class="doc-card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                        <h3><span class="doc-icon">📖</span> API Swagger</h3>
                        <p>Documentación interactiva de todos los endpoints con ejemplos y pruebas</p>
                    </a>
                    
                    <a href="https://github.com" class="doc-card" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                        <h3><span class="doc-icon">📝</span> README</h3>
                        <p>Guía de instalación, requisitos y configuración</p>
                    </a>
                    
                    <a href="https://github.com" class="doc-card" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                        <h3><span class="doc-icon">🏗️</span> Arquitectura</h3>
                        <p>Entender la estructura interna y patrones de diseño</p>
                    </a>
                    
                    <a href="https://github.com" class="doc-card" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
                        <h3><span class="doc-icon">🚀</span> Despliegue</h3>
                        <p>Guías para desplegar en Railway, Heroku, Docker, AWS</p>
                    </a>
                </div>
            </div>
            
            <div class="endpoints-summary">
                <h3>⚡ Endpoints Principales</h3>
                <div class="endpoint-list">
                    <div class="endpoint-item"><span class="method post">POST</span> /auth/register</div>
                    <div class="endpoint-item"><span class="method post">POST</span> /auth/login</div>
                    <div class="endpoint-item"><span class="method post">POST</span> /auth/refresh</div>
                    <div class="endpoint-item"><span class="method post">POST</span> /auth/logout</div>
                    <div class="endpoint-item"><span class="method get">GET</span> /tickets</div>
                    <div class="endpoint-item"><span class="method get">GET</span> /tickets/:id</div>
                    <div class="endpoint-item"><span class="method post">POST</span> /tickets/create</div>
                    <div class="endpoint-item"><span class="method put">PUT</span> /tickets/update/:id</div>
                    <div class="endpoint-item"><span class="method delete">DELETE</span> /tickets/delete/:id</div>
                    <div class="endpoint-item"><span class="method get">GET</span> /comment</div>
                    <div class="endpoint-item"><span class="method post">POST</span> /comment/created/:id</div>
                    <div class="endpoint-item"><span class="method put">PUT</span> /comment/edit/:id</div>
                </div>
            </div>
            
            <div class="info-section">
                <h2>🔧 Información del Sistema</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <strong>🌐 Base URL</strong>
                        <p>http://localhost:3000/api</p>
                    </div>
                    <div class="info-item">
                        <strong>🔐 Autenticación</strong>
                        <p>JWT Bearer Token</p>
                    </div>
                    <div class="info-item">
                        <strong>📊 Base de Datos</strong>
                        <p>PostgreSQL 12+</p>
                    </div>
                    <div class="info-item">
                        <strong>⚙️ ORM</strong>
                        <p>Prisma 6.19</p>
                    </div>
                    <div class="info-item">
                        <strong>📝 Validación</strong>
                        <p>Zod 4.4</p>
                    </div>
                    <div class="info-item">
                        <strong>🛡️ Seguridad</strong>
                        <p>Helmet, CORS, bcryptjs</p>
                    </div>
                </div>
            </div>
            
            <div class="footer">
                <p>Ticket Management API © 2024 | Última actualización: 15 de enero, 2024</p>
            </div>
        </div>
    </body>
    </html>
  `;
  
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(htmlContent);
});

/**
 * @swagger
 * /docs/health:
 *   get:
 *     summary: Health check del servidor
 *     description: Verifica que el servidor está funcionando correctamente
 *     tags:
 *       - Documentation
 *     responses:
 *       200:
 *         description: Servidor está funcionando
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   example: 123.456
 */
docsRouter.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development"
  });
});

/**
 * @swagger
 * /docs/info:
 *   get:
 *     summary: Información de la API
 *     description: Obtiene información general de la API
 *     tags:
 *       - Documentation
 *     responses:
 *       200:
 *         description: Información de la API
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 version:
 *                   type: string
 *                 description:
 *                   type: string
 *                 author:
 *                   type: string
 *                 docsUrl:
 *                   type: string
 */
docsRouter.get("/info", (req: Request, res: Response) => {
  res.status(200).json({
    name: "Ticket Management API",
    version: "1.0.0",
    description: "API para gestión de tickets con soporte para autenticación, comentarios y seguimiento",
    author: "Tu nombre",
    docsUrl: "http://localhost:3000/docs",
    swaggerUrl: "http://localhost:3000/api-docs",
    endpoints: {
      base: "http://localhost:3000/api",
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
        refresh: "POST /api/auth/refresh",
        logout: "POST /api/auth/logout"
      },
      tickets: {
        list: "GET /api/tickets",
        getById: "GET /api/tickets/:id",
        create: "POST /api/tickets/create",
        update: "PUT /api/tickets/update/:id",
        delete: "DELETE /api/tickets/delete/:id"
      },
      comments: {
        list: "GET /api/comment",
        create: "POST /api/comment/created/:id",
        update: "PUT /api/comment/edit/:id",
        delete: "DELETE /api/comment/:id"
      }
    },
    contact: "support@ticketapp.com"
  });
});

export { docsRouter };
