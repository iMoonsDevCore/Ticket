import { Router } from "express";
import morgan from "morgan";

const morganMiddleware = Router();

morganMiddleware.use(morgan("dev"));

export default morganMiddleware;