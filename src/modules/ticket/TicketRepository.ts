import prisma from "../../config/prisma"
import { TicketDTO } from "./dto/TicketDTO"

class TicketRepository {
    public async getALlTickets(){
        return await prisma.ticket.findMany()
    }

    public async getTicketById(id: number){
        return await prisma.ticket.findUnique({
            where: { id }
        })
    }

    public async createTicket(ticket: TicketDTO, userId: number){

        const assigned = ticket.assignedTo as string
        return await prisma.ticket.create({
            data: {
                title: ticket.title,
                description: ticket.description,
                status: ticket.status,
                priority: ticket.priority,
                asignatedTo: assigned ?? "Nadie",
                userId: userId
            }
        })
    }

    public async updateTicket(ticket: Partial<TicketDTO>){
        return await prisma.ticket.update({
            where: {
                id: ticket.id
            },
            data: {
                title: ticket.title,
                description: ticket.description,
                status: ticket.status,
                priority: ticket.priority,
                asignatedTo: ticket.assignedTo,
            }
        })
    }


    public async deleteTicket(ticketId: number){
        return await prisma.ticket.delete({
            where: {
                id: ticketId
            }
        })
    }
}

export const ticketRepository = new TicketRepository()