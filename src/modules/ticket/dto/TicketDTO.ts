import { TicketStatus, TicketCategory, TicketPriority } from "../ticket.interface"

export interface TicketDTO {
    id?: number
    title: string
    description: string
    status: TicketStatus
    category: TicketCategory
    assignedTo?: string | "Nadie"
    priority: TicketPriority | "LOW",
}