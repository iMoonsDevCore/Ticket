export class AppError extends Error {
    public readonly statusCode: number
    public readonly isOperational: boolean

    constructor(message: string, statusCode = 500, isOperational = true) {
        super(message)
        this.statusCode = statusCode
        this.isOperational = isOperational
        Object.setPrototypeOf(this, AppError.prototype)
    }
}

export const notFound = (message = "Recurso no encontrado") =>
    new AppError(message, 404)

export const badRequest = (message = "Solicitud inválida") =>
    new AppError(message, 400)

export const unauthorized = (message = "No autorizado") =>
    new AppError(message, 401)

export const forbidden = (message = "Acceso denegado") =>
    new AppError(message, 403)

export const conflict = (message = "Conflicto con el estado actual") =>
    new AppError(message, 409)

export const internal = (message = "Error interno del servidor") =>
    new AppError(message, 500)
