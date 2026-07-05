import { Router } from "express";
import { authRouter } from "../auth/AuthRouter";

const indexRouter = Router();

indexRouter.use("/auth", authRouter);

export { indexRouter };