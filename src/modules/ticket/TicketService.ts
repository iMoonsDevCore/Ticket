import { ticketRepository } from "./TicketRepository"

class TicketService {
    private readonly ticketRepository: typeof ticketRepository

    constructor(){
        this.ticketRepository = ticketRepository
    }

    public async getAllTickets(){
        const tickets = await this.ticketRepository.getALlTickets()

        if(!tickets.length){
            throw new Error("No hay tickets disponibles")
        }

        return tickets
    }

    public async getTicketById(id: number){
        const ticket = await this.ticketRepository.getTicketById(id)

        if(!ticket){
            throw new Error("Ticket no encontrado")
        }

        return ticket
    }
}