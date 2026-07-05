import { UserRole } from "../modules/user/user.interface"

declare global {
    namespace Express {
        interface Request {
            user?: { id: number; role: UserRole }
        }
    }
}

export {}
