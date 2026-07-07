import { Router} from "express"
import { ticketController } from "./TicketController"
import { verifyRole } from "../middlewares/verifyRole"
import { verifyToken } from "../middlewares/verifyToken"
import { UserRole } from "../user/user.interface"

export const ticketRouter = Router()

/**
 * @swagger
 * /tickets:
 *   get:
 *     summary: Obtener todos los tickets
 *     description: |
 *       Recupera una lista de TODOS los tickets del sistema.
 *       
 *       **Filtros disponibles:**
 *       - status: OPEN, IN_PROGRESS, RESOLVED, CLOSED
 *       - priority: LOW, MEDIUM, HIGH, CRITICAL
 *       
 *       **Requerimientos:**
 *       - ✅ Autenticación requerida
 *       - ✅ Rol requerido: TECHNICIAN, ADMIN
 *       
 *       **Casos de uso:**
 *       - Ver carga de trabajo total
 *       - Reportes de tickets
 *       - Dashboard administrativo
 *     tags:
 *       - Tickets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [OPEN, IN_PROGRESS, RESOLVED, CLOSED]
 *         description: Filtrar por estado
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH, CRITICAL]
 *         description: Filtrar por prioridad
 *     responses:
 *       200:
 *         description: Lista de tickets obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Ticket'
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Permisos insuficientes (se requiere TECHNICIAN o ADMIN)
 */
ticketRouter.get("/", 
    verifyToken, 
    verifyRole(UserRole.TECHNICIAN, UserRole.ADMIN), 
    ticketController.getAllTickets
)

ticketRouter.get("/filter",
    verifyToken, 
    verifyRole(UserRole.TECHNICIAN, UserRole.ADMIN),
    ticketController.getTicketByFilter
)
/**
 * @swagger
 * /tickets/{id}:
 *   get:
 *     summary: Obtener ticket por ID
 *     description: |
 *       Recupera los detalles completos de un ticket específico.
 *       
 *       **Información incluida:**
 *       - Detalles del ticket (título, descripción, estado, prioridad)
 *       - Usuario creador
 *       - Asignado a
 *       - Fechas de creación y actualización
 *       
 *       **Requerimientos:**
 *       - ✅ Autenticación requerida
 *       - ✅ Rol requerido: TECHNICIAN, ADMIN
 *       
 *       **Errores comunes:**
 *       - 404: Ticket no existe
 *       - 403: No tienes permisos
 *     tags:
 *       - Tickets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 550e8400-e29b-41d4-a716-446655440000
 *         description: ID único del ticket
 *     responses:
 *       200:
 *         description: Detalles del ticket
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Ticket'
 *       404:
 *         description: Ticket no encontrado
 *       403:
 *         description: Permisos insuficientes
 */
ticketRouter.get("/:id",  
    verifyToken, 
    verifyRole(UserRole.TECHNICIAN, UserRole.ADMIN),
    ticketController.getTicketById
)

/**
 * @swagger
 * /tickets/create:
 *   post:
 *     summary: Crear nuevo ticket
 *     description: |
 *       Crea un nuevo ticket de soporte en el sistema.
 *       
 *       **Flujo:**
 *       1. El usuario describe el problema
 *       2. Sistema asigna un ID único (UUID)
 *       3. Estado inicial: OPEN
 *       4. Prioridad por defecto: LOW (se puede cambiar)
 *       
 *       **Validaciones:**
 *       - Título: mínimo 5, máximo 100 caracteres
 *       - Descripción: mínimo 10, máximo 2000 caracteres
 *       - Prioridad: LOW, MEDIUM, HIGH, CRITICAL
 *       
 *       **Requerimientos:**
 *       - ✅ Autenticación requerida
 *       - ✅ Cualquier rol puede crear (USER, TECHNICIAN, ADMIN)
 *       
 *       **Después de crear:**
 *       - El ticket aparece en el sistema
 *       - Técnicos pueden verlo
 *       - Se pueden agregar comentarios
 *     tags:
 *       - Tickets
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - priority
 *               - asignatedTo
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 100
 *                 example: Error en el sistema de pago
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 2000
 *                 example: El sistema de pago está retornando error 500 cuando intento procesar una transacción
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH, CRITICAL]
 *                 example: HIGH
 *               asignatedTo:
 *                 type: string
 *                 format: email
 *                 example: soporte@ticketapp.com
 *           examples:
 *             ticket_urgente:
 *               value:
 *                 title: Sistema de login no funciona
 *                 description: Los usuarios no pueden iniciar sesión desde hace 30 minutos
 *                 priority: CRITICAL
 *                 asignatedTo: senior-support@ticketapp.com
 *     responses:
 *       201:
 *         description: Ticket creado exitosamente
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
 *                   $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Validación fallida
 *       401:
 *         description: No autenticado
 */
ticketRouter.post("/create", 
    verifyToken,
    verifyRole(UserRole.USER, UserRole.ADMIN, UserRole.TECHNICIAN),
    ticketController.createTicket
)

/**
 * @swagger
 * /tickets/update/{id}:
 *   put:
 *     summary: Actualizar ticket
 *     description: |
 *       Actualiza los detalles de un ticket existente.
 *       
 *       **Campos que se pueden actualizar:**
 *       - title: Título del ticket
 *       - description: Descripción detallada
 *       - status: OPEN → IN_PROGRESS → RESOLVED → CLOSED
 *       - priority: Cambiar importancia
 *       - asignatedTo: Reasignar a otro técnico
 *       
 *       **Cambios de estado:**
 *       - OPEN: Ticket nuevo sin atender
 *       - IN_PROGRESS: Técnico está trabajando
 *       - RESOLVED: Solución implementada
 *       - CLOSED: Confirmado y finalizado
 *       
 *       **Requerimientos:**
 *       - ✅ Autenticación requerida
 *       - ✅ Rol requerido: TECHNICIAN, ADMIN
 *       - ✅ Solo estos roles pueden cambiar estado
 *       
 *       **Auditoría:**
 *       - Se registra quién hizo el cambio
 *       - Se guarda timestamp de actualización
 *     tags:
 *       - Tickets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 550e8400-e29b-41d4-a716-446655440000
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [OPEN, IN_PROGRESS, RESOLVED, CLOSED]
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH, CRITICAL]
 *               asignatedTo:
 *                 type: string
 *           examples:
 *             cambiar_estado:
 *               value:
 *                 status: IN_PROGRESS
 *                 priority: CRITICAL
 *             resolver_ticket:
 *               value:
 *                 status: RESOLVED
 *     responses:
 *       200:
 *         description: Ticket actualizado
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
 *                   $ref: '#/components/schemas/Ticket'
 *       404:
 *         description: Ticket no encontrado
 *       403:
 *         description: Permisos insuficientes
 */
ticketRouter.put("/update/:id", 
    verifyToken,
    verifyRole(UserRole.ADMIN, UserRole.TECHNICIAN),
    ticketController.updateTicket
)

/**
 * @swagger
 * /tickets/delete/{id}:
 *   delete:
 *     summary: Eliminar ticket
 *     description: |
 *       Elimina un ticket completamente del sistema.
 *       
 *       **Advertencia:**
 *       - ⚠️ Esta acción es IRREVERSIBLE
 *       - Se elimina el ticket y TODOS sus comentarios
 *       - No hay opción de recuperar
 *       
 *       **Recomendación:**
 *       - Marcar como CLOSED en lugar de eliminar
 *       - Usar delete solo en casos excepcionales
 *       - Mantener auditoría antes de eliminar
 *       
 *       **Requerimientos:**
 *       - ✅ Autenticación requerida
 *       - ✅ Rol requerido: TECHNICIAN, ADMIN
 *       - ✅ Solo administradores pueden eliminar en producción
 *     tags:
 *       - Tickets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 550e8400-e29b-41d4-a716-446655440000
 *     responses:
 *       200:
 *         description: Ticket eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: Ticket eliminado exitosamente
 *       404:
 *         description: Ticket no encontrado
 *       403:
 *         description: Permisos insuficientes
 */
ticketRouter.delete("/delete/:id",
    verifyToken,
    verifyRole(UserRole.ADMIN, UserRole.TECHNICIAN),
    ticketController.deleteTicket
)