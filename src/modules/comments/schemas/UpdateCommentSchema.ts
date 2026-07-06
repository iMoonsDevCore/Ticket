import { z } from 'zod';

export const updateCommentSchema = z.object({
  content: z.string().min(1, 'El contenido del comentario es requerido').max(2000, 'El contenido no puede exceder 2000 caracteres'),
});

export type UpdateCommentRequest = z.infer<typeof updateCommentSchema>;
