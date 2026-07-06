import { Router } from "express";
import { authRouter } from "../auth/AuthRouter";
import { ticketRouter } from "../ticket/TicketRouter";
import { commentRouter } from "../comments/CommentsRouter";
import { docsRouter } from "../docs/DocsRouter";

const indexRouter = Router();

indexRouter.use("/auth", authRouter);
indexRouter.use("/tickets", ticketRouter);
indexRouter.use("/comment", commentRouter);
indexRouter.use("/docs", docsRouter);

export { indexRouter };