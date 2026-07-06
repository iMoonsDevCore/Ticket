import app from ".";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env";
import { specs } from "./config/swagger";
import morganMiddleware from "./modules/middlewares/morgan";
import helmetMiddleware from "./modules/middlewares/helmet";
import { indexRouter } from "./modules/middlewares/router";
import { errorHandler } from "./modules/middlewares/errorHandler";

app.use(express.json());
app.use(morganMiddleware);
app.use(helmetMiddleware)

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/api", indexRouter);
app.use(errorHandler);

app.listen(env.PORT, () => {
    console.log(`[Servidor] Servidor escuchando en http://localhost:${env.PORT}`);
    console.log(`[Swagger] Documentación disponible en http://localhost:${env.PORT}/api-docs`);
})
