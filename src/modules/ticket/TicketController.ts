import { Request, Response, NextFunction } from "express"
import { ticketService } from "./TicketService"
import { createTicketSchema } from "./schemas/TicketSchema"


class TicketController {
    private ticketService: typeof ticketService

    constructor(){
        this.ticketService = ticketService
    }

    public getAllTickets = async (req: Request, res: Response) => {
        try {
            const tickets = await this.ticketService.getAllTickets()

            return res.status(200).json({
                success: true,
                data: tickets,
            })
        } catch (error) {
            console.error(error)
            return res.status(500).json({
                success: false,
                message: "Error al obtener los tickets",
            })
        }
    }

    public getTicketById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params as { id: string }

            const ticket = await this.ticketService.getTicketById(id)

            return res.status(200).json({
                success: true,
                data: ticket
            })
        } catch (error) {
            next(error)
        }
    }

    public createTicket = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsedData = createTicketSchema.safeParse(req.body)

            if (!parsedData.success) {
                return res.status(400).json({ message: parsedData.error })
            }

            const taskData = parsedData.data

            if (!req.user) {
                return res.status(401).json({ message: "Unauthorized" })
            }

            const newTicket = await this.ticketService.createTicket(req.user.id, {
                id: taskData.id,
                title: taskData.title,
                description: taskData.description,
                status: taskData.status,
                priority: taskData.priority,
                assignedTo: taskData.assignedTo
            })

            return res.status(200).json({
                success: true,
                newTicket
            })

        } catch (error) {
            next(error)
            return res.status(500)
        }
    }
}

export const ticketController = new TicketController()