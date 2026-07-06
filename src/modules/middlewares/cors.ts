import { Router } from "express";
import cors from "cors"
import { env } from "../../config/env"

export const corsMiddleware = Router()

const allowedOrigins = (env.CORS_ORIGIN || "*")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

corsMiddleware.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
                callback(null, true);
                return;
            }

            callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
)