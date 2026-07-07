import { TicketDTO } from "./dto/TicketDTO"
import { ticketRepository } from "./TicketRepository"
import { internal, notFound } from "../helpers/AppError"
import { GetTicketsFilter } from "./ticket.interface"
import prisma from "../../config/prisma"

class TicketService {
    private ticketRepository: typeof ticketRepository

    constructor(){
        this.ticketRepository = ticketRepository
    }

    public async getAllTickets(){
        const tickets = await this.ticketRepository.getALlTickets()

        if(!tickets.length){
            throw notFound("No hay tickets creados")
        }

        return tickets
    }

    public async getTicketByFilter(filter: GetTicketsFilter){
        const filteredTickets = await this.ticketRepository.getTicketByFilter(filter)

        return filteredTickets
    }

    public async getTicketById(id: string){
        const ticket = await this.ticketRepository.getTicketById(id)

        if(!ticket){
            throw notFound("Ticket no encontrado")
        }

        return ticket
    }

    public async createTicket(userId: number, ticket: TicketDTO,){

        const exist = await prisma.ticket.findFirst({
            where: {
                title: ticket.title,
                userId,
                status: {
                    notIn: ["CLOSED", "RESOLVED"]
                }
            }
        })

        if(exist){
            throw notFound("Este ticket ya existe")
        }

        const newTicket = await this.ticketRepository.createTicket(ticket, userId)

        if(!newTicket){
            throw internal("Error al crear el ticket")
        }

        return newTicket
    }

    public async updateTicket(userId: number, ticket: Partial<TicketDTO>){
        const updatedTicket = await this.ticketRepository.updateTicket(userId, ticket)

        if(!updatedTicket){
            throw internal("Error al actualizar el ticket")
        }

        return updatedTicket
    }

    public async deleteTicket(id: string){

        const exist = await prisma.ticket.findFirst({
            where: {
                id
            }
        })

        if(!exist){
            throw notFound("Este ticket no existe")
        }
        const deletedTicket = await this.ticketRepository.deleteTicket(id)

        if(!deletedTicket){
            throw internal("Error al eliminar el ticket")
        }

        return deletedTicket
    }
}

export const ticketService = new TicketService()