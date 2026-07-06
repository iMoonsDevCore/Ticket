import { z } from "zod"

export const createTicketSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, "El titulo es requerido"),
    description: z.string().min(1, "La descripcion es requerida"),
    status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"],
        {
            error: "Status is required"
        }
    ),
    priority: z.enum(["LOW", "MEDIUM", "HIGH",
        "CRITICAL"
    ], {
        error: "La prioridad es requerida",
    }).optional(),
    assignedTo: z.string().optional(),
  })