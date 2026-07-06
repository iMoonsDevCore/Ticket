import { z } from 'zod';

export const createCommentSchema = z.object({
  ticketId: z.string().min(1, 'El ID del ticket es requerido'),
  content: z.string().min(1, 'El contenido del comentario es requerido').max(2000, 'El contenido no puede exceder 2000 caracteres'),
});

export type CreateCommentRequest = z.infer<typeof createCommentSchema>;
