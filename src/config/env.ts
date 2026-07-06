import dotenv from "dotenv";

dotenv.config();

export const env = {
    PORT: process.env.PORT || 8000,
    DATABASE_URL: process.env.DATABASE_URL,
    HASH_SALT: process.env.HASH_SALT || 10,
    JWT_TEMPORAL_SECRET: process.env.JWT_TEMPORAL_SECRET || "dev_temporal_secret_change_me",
    JWT_TEMPORAL_EXPIRES_IN: process.env.JWT_TEMPORAL_EXPIRES_IN || "1h",
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "dev_refresh_secret_change_me",
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000,http://localhost:5173,http://localhost:8000",
}