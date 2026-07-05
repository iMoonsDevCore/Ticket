import { TicketDTO } from "./dto/TicketDTO"
import { ticketRepository } from "./TicketRepository"
import { internal, notFound } from "../helpers/AppError"

class TicketService {
    private ticketRepository: typeof ticketRepository

    constructor(){
        this.ticketRepository = ticketRepository
    }

    public async getAllTickets(){
        const tickets = await this.ticketRepository.getALlTickets()

        return tickets
    }

    public async getTicketById(id: string){
        const ticket = await this.ticketRepository.getTicketById(id)

        if(!ticket){
            throw notFound("Ticket no encontrado")
        }

        return ticket
    }

    public async createTicket(userId: number, ticket: TicketDTO,){
        const newTicket = await this.ticketRepository.createTicket(ticket, userId)

        if(!newTicket){
            throw internal("Error al crear el ticket")
        }

        return newTicket
    }

    public async updateTicket(ticket: Partial<TicketDTO>){
        const updatedTicket = await this.ticketRepository.updateTicket(ticket)

        if(!updatedTicket){
            throw internal("Error al actualizar el ticket")
        }

        return updatedTicket
    }

    public async deleteTicket(id: string){
        const deletedTicket = await this.ticketRepository.deleteTicket(id)

        if(!deletedTicket){
            throw internal("Error al eliminar el ticket")
        }

        return deletedTicket
    }
}

export const ticketService = new TicketService()