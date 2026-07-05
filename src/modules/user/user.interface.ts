export enum UserRole {
    ADMIN = 'ADMIN',
    TECHNICIAN = 'TECHNICIAN',
    USER = 'USER'
}

export interface User {
    id?: string,
    name: string,
    email: string,
    password: string,
    role: UserRole,
    refreshToken?: string,
    createdAt?: Date,
    updatedAt?: Date
}