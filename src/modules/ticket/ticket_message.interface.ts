export interface TicketMessage {
    id?: string,
    ticketId: string,
    message: string,
    createdBy: string,
    createdAt?: Date,
    updatedAt?: Date
}