import dotenv from "dotenv";

dotenv.config();

export const env = {
    PORT: process.env.PORT || 8000,
    DATABASE_URL: process.env.DATABASE_URL,
    HASH_SALT: process.env.HASH_SALT || 10,
    JWT_TEMPORAL_SECRET: process.env.JWT_TEMPORAL_SECRET,
    JWT_TEMPORAL_EXPIRES_IN: process.env.JWT_TEMPORAL_EXPIRES_IN,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
}