import { Router } from "express";
import helmet from "helmet";

const helmetMiddleware = Router();

helmetMiddleware.use(helmet());

export default helmetMiddleware;