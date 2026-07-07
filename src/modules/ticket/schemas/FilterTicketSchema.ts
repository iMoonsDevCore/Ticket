import { z } from "zod"
import { TicketPriority, TicketStatus } from "../ticket.interface";

export const getTicketsFilterSchema = z.object({
    status: z.enum(TicketStatus).optional(),
    priority: z.enum(TicketPriority).optional(),
    authorId: z.string().optional()
});