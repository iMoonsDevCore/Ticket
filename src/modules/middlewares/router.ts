import { Router } from "express";
import { authRouter } from "../auth/AuthRouter";
import { ticketRouter } from "../ticket/TicketRouter";

const indexRouter = Router();

indexRouter.use("/auth", authRouter);
indexRouter.use("/tickets", ticketRouter);

export { indexRouter };