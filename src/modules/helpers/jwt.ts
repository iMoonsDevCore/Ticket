import jwt from "jsonwebtoken";
import { env } from "../../config/env";

class JwtHelpers {
    public generateToken = (payload: any) => {
        return jwt.sign(payload, env.JWT_TEMPORAL_SECRET as string, { expiresIn: (env.JWT_TEMPORAL_EXPIRES_IN || "1h") as any });
    }

    public generateRefreshToken = (payload: any) => {
        return jwt.sign(payload, env.JWT_REFRESH_SECRET as string, { expiresIn: (env.JWT_REFRESH_EXPIRES_IN || "7d") as any });
    }

    public verifyTemporalToken = (token: string) => {
        return jwt.verify(token, env.JWT_TEMPORAL_SECRET as string);
    }

    public verifyRefreshToken = (token: string) => {
        return jwt.verify(token, env.JWT_REFRESH_SECRET as string);
    }

    public decodeToken = (token: string) => {
        return jwt.decode(token);
    }

}

export const jwtHelpers = new JwtHelpers();