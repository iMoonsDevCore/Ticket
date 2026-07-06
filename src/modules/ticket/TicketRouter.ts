import { Router} from "express"
import { ticketController } from "./TicketController"
import { verifyRole } from "../middlewares/verifyRole"
import { verifyToken } from "../middlewares/verifyToken"
import { UserRole } from "../user/user.interface"

export const ticketRouter = Router()

ticketRouter.get("/", 
    verifyToken, 
    verifyRole(UserRole.TECHNICIAN, UserRole.ADMIN), 
    ticketController.getAllTickets
)


ticketRouter.get("/:id",  
    verifyToken, 
    verifyRole(UserRole.TECHNICIAN, UserRole.ADMIN),
    ticketController.getTicketById
)

ticketRouter.post("/create", 
    verifyToken,
    verifyRole(UserRole.USER, UserRole.ADMIN, UserRole.TECHNICIAN),
    ticketController.createTicket
)

ticketRouter.put("/update/:id", 
    verifyToken,
    verifyRole(UserRole.ADMIN, UserRole.TECHNICIAN),
    ticketController.updateTicket
)

ticketRouter.delete("/delete/:id",
    verifyToken,
    verifyRole(UserRole.ADMIN, UserRole.TECHNICIAN),
    ticketController.deleteTicket
)