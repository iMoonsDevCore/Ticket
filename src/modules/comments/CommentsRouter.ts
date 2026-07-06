import { Router } from "express";
import { verifyRole } from "../middlewares/verifyRole"
import { verifyToken } from "../middlewares/verifyToken"
import { UserRole } from "../user/user.interface"
import { commentController } from "./CommentsController";

export const commentRouter = Router()

/**
 * @swagger
 * /comment:
 *   get:
 *     summary: Obtener todos los comentarios
 *     description: |
 *       Recupera una lista de TODOS los comentarios del sistema.
 *       
 *       **Información incluida:**
 *       - Contenido del comentario
 *       - Usuario que comentó
 *       - Ticket relacionado
 *       - Fechas de creación y actualización
 *       
 *       **Requerimientos:**
 *       - ✅ Autenticación requerida
 *       - ✅ Rol requerido: TECHNICIAN, ADMIN
 *       
 *       **Casos de uso:**
 *       - Ver historial completo de interacciones
 *       - Análisis y reportes
 *       - Dashboard administrativo
 *       
 *       **Nota:**
 *       - Solo técnicos y admins pueden ver todos
 *       - Usuarios solo ven comentarios de sus tickets
 *     tags:
 *       - Comentarios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de comentarios
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
 *                     $ref: '#/components/schemas/Comment'
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Permisos insuficientes (se requiere TECHNICIAN o ADMIN)
 */
commentRouter.get("/", 
     verifyToken,
     verifyRole(UserRole.TECHNICIAN, UserRole.ADMIN),
     commentController.getAllComment
    )

/**
 * @swagger
 * /comment/created/{id}:
 *   post:
 *     summary: Crear nuevo comentario
 *     description: |
 *       Agrega un comentario nuevo a un ticket específico.
 *       
 *       **Propósito:**
 *       - Técnico proporciona actualizaciones de progreso
 *       - Usuario explica el problema con más detalle
 *       - Comunicación entre técnico y usuario
 *       
 *       **Flujo:**
 *       1. Usuario auténtico escribe comentario
 *       2. Sistema asocia con el ticket
 *       3. Se registra fecha/hora
 *       4. Aparece en historial del ticket
 *       
 *       **Validaciones:**
 *       - Contenido: mínimo 1, máximo 2000 caracteres
 *       - El ticket debe existir
 *       - Usuario debe estar autenticado
 *       
 *       **Requerimientos:**
 *       - ✅ Autenticación requerida
 *       - ✅ Cualquier rol puede comentar
 *       - ✅ Acceso al ticket requerido
 *     tags:
 *       - Comentarios
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
 *         description: ID del ticket donde comentar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ticketId
 *               - content
 *             properties:
 *               ticketId:
 *                 type: string
 *                 format: uuid
 *                 example: 550e8400-e29b-41d4-a716-446655440000
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 2000
 *                 example: He revisado el problema y encontré que es un error de conexión a BD
 *           examples:
 *             comentario_tecnico:
 *               value:
 *                 ticketId: 550e8400-e29b-41d4-a716-446655440000
 *                 content: El problema está siendo investigado. Necesito acceso a los logs del servidor.
 *             comentario_usuario:
 *               value:
 *                 ticketId: 550e8400-e29b-41d4-a716-446655440000
 *                 content: Gracias por la respuesta. ¿Cuándo estará resuelto?
 *     responses:
 *       201:
 *         description: Comentario creado exitosamente
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
 *                   $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Validación fallida
 *       401:
 *         description: No autenticado
 *       404:
 *         description: Ticket no encontrado
 */
commentRouter.post("/created/:id", 
     verifyToken,
     verifyRole(UserRole.USER, UserRole.TECHNICIAN, UserRole.ADMIN),
     commentController.createComment
)

/**
 * @swagger
 * /comment/edit/{id}:
 *   put:
 *     summary: Actualizar comentario
 *     description: |
 *       Edita un comentario existente.
 *       
 *       **Restricciones:**
 *       - Solo el autor del comentario puede editar
 *       - Admins pueden editar cualquier comentario
 *       - No se puede cambiar el timestamp de creación
 *       - Se actualiza el campo "updatedAt"
 *       
 *       **Casos de uso:**
 *       - Corregir errores de tipeo
 *       - Agregar información adicional
 *       - Clarificar detalles técnicos
 *       
 *       **Auditoría:**
 *       - Se registra que fue editado
 *       - Se guarda timestamp de edición
 *       - No se borra el contenido original
 *       
 *       **Requerimientos:**
 *       - ✅ Autenticación requerida
 *       - ✅ Ser autor del comentario O ser admin
 *     tags:
 *       - Comentarios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 660e8500-f29b-41d4-a716-446655440000
 *         description: ID del comentario a editar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 2000
 *                 example: He encontrado la solución al problema
 *     responses:
 *       200:
 *         description: Comentario actualizado
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
 *                   $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comentario no encontrado
 *       403:
 *         description: No eres el autor o no tienes permisos
 */
commentRouter.put("/edit/:id",
     verifyToken,
     verifyRole(UserRole.USER, UserRole.TECHNICIAN, UserRole.ADMIN),
     commentController.updateComment
)

/**
 * @swagger
 * /comment/{id}:
 *   delete:
 *     summary: Eliminar comentario
 *     description: |
 *       Elimina un comentario completamente del sistema.
 *       
 *       **Advertencia:**
 *       - ⚠️ Esta acción es IRREVERSIBLE
 *       - Se elimina el contenido permanentemente
 *       - No hay opción de recuperar
 *       
 *       **Restricciones:**
 *       - Solo el autor puede eliminar su comentario
 *       - Admins pueden eliminar cualquier comentario
 *       - No se puede eliminar comentario de resuelto
 *       
 *       **Recomendación:**
 *       - Editar el comentario con "[Eliminado]" en lugar de borrar
 *       - Mantener auditoría de lo que se eliminó
 *       - En producción, no permitir eliminación de comentarios
 *       
 *       **Requerimientos:**
 *       - ✅ Autenticación requerida
 *       - ✅ Ser autor del comentario O ser admin
 *     tags:
 *       - Comentarios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 660e8500-f29b-41d4-a716-446655440000
 *         description: ID del comentario a eliminar
 *     responses:
 *       200:
 *         description: Comentario eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: Comentario eliminado exitosamente
 *       404:
 *         description: Comentario no encontrado
 *       403:
 *         description: No eres el autor o no tienes permisos
 */
commentRouter.delete("/:id",
     verifyToken,
     verifyRole(UserRole.USER, UserRole.TECHNICIAN, UserRole.ADMIN),
     commentController.deleteComment
)