import { Request, Response, NextFunction } from 'express'

export const verifyRole = (requiredRole: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.body.user.role

        if (!user) {
            return res.status(403).json({ message: 'Forbidden: No role found' })
        }
        
        if (user !== requiredRole) {
            return res.status(403).json({ message: 'Forbidden: Insufficient permissions' })
        }
        next()
    }
}