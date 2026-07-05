import { Request, Response, NextFunction } from 'express'
import { jwtHelpers } from '../helpers/jwt'
import { UserRole } from '../user/user.interface'

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    try {
        const user = jwtHelpers.verifyTemporalToken(token) as { id: number; role: UserRole }
        req.user = user
        next()
    } catch {
        return res.status(401).json({ message: 'Invalid token' })
    }
}