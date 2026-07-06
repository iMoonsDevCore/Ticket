import { z } from "zod"

export const UpdateTicketSchema = z.object({
    title: z.string()
})