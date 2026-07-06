import { TicketStatus, TicketPriority } from "@prisma/client"

export interface TicketDTO {
    id?: string
    title: string
    description: string
    status: TicketStatus
    assignedTo?: string | "Nadie"
    priority?: TicketPriority
}