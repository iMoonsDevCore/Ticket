import { Router } from "express";
import { authController } from "../auth/AuthController";
import { verifyToken } from "../middlewares/verifyToken";

const authRouter = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     description: |
 *       Crea una nueva cuenta de usuario en el sistema.
 *       
 *       **Características:**
 *       - Valida que el email sea único
 *       - Hashea la contraseña con bcryptjs
 *       - Retorna JWT access token
 *       - Rol por defecto: USER
 *       
 *       **Validaciones:**
 *       - Email debe ser válido
 *       - Nombre mínimo 2 caracteres
 *       - Contraseña mínimo 8 caracteres
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: Juan Pérez
 *               email:
 *                 type: string
 *                 format: email
 *                 example: juan@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: Password123!
 *           examples:
 *             usuario_nuevo:
 *               value:
 *                 name: Juan Pérez
 *                 email: juan.perez@example.com
 *                 password: MiPassword123!
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Usuario registrado exitosamente
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       description: JWT token para autenticación
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: Email ya está registrado
 *               status: 400
 *       500:
 *         description: Error del servidor
 */
authRouter.post("/register", authController.registerUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     description: |
 *       Autentica un usuario existente y retorna un JWT token.
 *       
 *       **Proceso:**
 *       1. Valida que el usuario exista
 *       2. Verifica la contraseña con bcryptjs
 *       3. Genera JWT access token
 *       4. Retorna datos del usuario (sin contraseña)
 *       
 *       **Importante:**
 *       - El token expira en 1 hora
 *       - Usar endpoint /refresh para obtener nuevo token
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: juan@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Inicio de sesión exitoso
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       description: Token JWT para usar en endpoints protegidos
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Usuario no encontrado
 */
authRouter.post("/login", authController.loginUser);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refrescar token
 *     description: |
 *       Obtiene un nuevo access token usando el refresh token.
 *       
 *       **Cuándo usar:**
 *       - Cuando el access token está por expirar
 *       - Error 401 en endpoints protegidos
 *       - De forma periódica en apps de larga duración
 *     tags:
 *       - Autenticación
 *     responses:
 *       200:
 *         description: Token actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *       401:
 *         description: Token inválido o expirado
 */
authRouter.post("/refresh", authController.refreshToken);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Cerrar sesión
 *     description: |
 *       Invalida la sesión del usuario actual.
 *       
 *       **Acción:**
 *       - Elimina refresh token de BD
 *       - Usuario debe hacer login nuevamente
 *       
 *       **Requerimientos:**
 *       - ✅ Autenticación requerida (Bearer token)
 *     tags:
 *       - Autenticación
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Sesión cerrada exitosamente
 *       401:
 *         description: No autenticado
 */
authRouter.post("/logout", verifyToken, authController.logoutUser);

/**
 * @swagger
 * /auth/mytoken:
 *   get:
 *     summary: Obtener datos del token actual
 *     description: |
 *       Retorna la información decodificada del JWT token actual.
 *       
 *       **Información incluida:**
 *       - User ID
 *       - Email
 *       - Rol
 *       - Fecha emisión (iat)
 *       - Fecha expiración (exp)
 *       
 *       **Uso:**
 *       - Verificar identidad del usuario
 *       - Debug de tokens
 *       - Sincronizar estado en cliente
 *       
 *       **Requerimientos:**
 *       - ✅ Autenticación requerida
 *     tags:
 *       - Autenticación
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: juan@example.com
 *                     role:
 *                       type: string
 *                       enum: [USER, TECHNICIAN, ADMIN]
 *                       example: USER
 *                     iat:
 *                       type: integer
 *                       description: Timestamp de emisión
 *                       example: 1705325400
 *                     exp:
 *                       type: integer
 *                       description: Timestamp de expiración
 *                       example: 1705329000
 *       401:
 *         description: Token inválido o expirado
 */
authRouter.get("/mytoken", verifyToken, (req, res) => {
    res.status(200).json({ user: req.user });
});

export { authRouter };