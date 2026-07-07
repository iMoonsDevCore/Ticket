import prisma from "../../config/prisma"
import { TicketDTO } from "./dto/TicketDTO"

class TicketRepository {
    public async getALlTickets() {
        return await prisma.ticket.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                comments: {
                    select: {
                        content: true,
                        user: {
                            select: { id: true, name: true }
                        }
                    }
                }
            }
        })
    }

    public async getTicketById(id: string) {
        return await prisma.ticket.findUnique({
            where: { id }
        })
    }

    public async createTicket(ticket: TicketDTO, userId: number) {

        const assigned = ticket.assignedTo as string
        return await prisma.ticket.create({
            data: {
                title: ticket.title,
                description: ticket.description,
                status: ticket.status,
                priority: ticket.priority ?? "LOW",
                asignatedTo: assigned ?? "Nadie",
                userId: userId
            }
        })
    }

    public async updateTicket(userId: number, ticket: Partial<TicketDTO>) {
        return await prisma.ticket.update({
            where: {
                id: ticket.id,
                userId
            },
            data: {
                title: ticket.title,
                description: ticket.description,
                status: ticket.status,
                priority: ticket.priority ?? "LOW",
                asignatedTo: ticket.assignedTo,
            }
        })
    }


    public async deleteTicket(id: string) {
        return await prisma.ticket.delete({
            where: {
                id
            }
        })
    }

    public async getTicketByFilter(where: {}){
        return await prisma.ticket.findMany({
            where
        })
    }
}

export const ticketRepository = new TicketRepository()