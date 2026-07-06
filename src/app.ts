import app from ".";
import express from "express";
import { env } from "./config/env";
import morganMiddleware from "./modules/middlewares/morgan";
import helmetMiddleware from "./modules/middlewares/helmet";
import { indexRouter } from "./modules/middlewares/router";
import { errorHandler } from "./modules/middlewares/errorHandler";

app.use(express.json());
app.use(morganMiddleware);
app.use(helmetMiddleware)

app.use("/api", indexRouter);
app.use(errorHandler);

app.listen(env.PORT, () => {
    console.log(`[Servidor] Servidor escuchando en http://localhost:${env.PORT}`);
})
