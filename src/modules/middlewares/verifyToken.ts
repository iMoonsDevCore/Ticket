import { Request, Response, NextFunction } from 'express'
import { jwtHelpers } from '../helpers/jwt'

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const token = authHeader.split(' ')[1]

    try {
        const decoded = jwtHelpers.decodeToken(token)
        const isTokenValid = jwtHelpers.verifyTemporalToken(token)
        const isRefreshTokenValid = jwtHelpers.verifyRefreshToken(token)

        if (!decoded || (!isTokenValid && !isRefreshTokenValid)) {
            return res.status(401).json({ message: 'Invalid token' })
        }

        req.body.user = decoded

        next()
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' })
    }
}