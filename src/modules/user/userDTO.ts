import { UserRole } from "./user.interface";

export interface UserDTO {
    username: string,
    email: string,
    password: string,
    role?: UserRole,
    refreshToken?: string
}