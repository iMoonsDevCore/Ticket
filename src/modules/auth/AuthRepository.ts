import prisma from "../../config/prisma"
import { UserDTO } from "../user/userDTO"
import { UserRole } from "../user/user.interface"

class AuthRepository {
    public async findUser(email: string) {
        const find = await prisma.user.findUnique({
            where: {
                email
            }
        })
        return find
    }

    public async registerUser(data: UserDTO ){
        const createdData = await prisma.user.create({
            data: {
                name: data.username,
                email: data.email,
                password: data.password,
                role: data.role || UserRole.USER
            }
        })

        return createdData
    }

    public async updateUser(id: number, data: Partial<Pick<UserDTO, "username" | "email" | "password" | "role" | "refreshToken">>) {
        const updatedData = await prisma.user.update({
            where: {
                id
            },
            data: {
                ...(data.username !== undefined ? { name: data.username } : {}),
                ...(data.email !== undefined ? { email: data.email } : {}),
                ...(data.password !== undefined ? { password: data.password } : {}),
                ...(data.role !== undefined ? { role: data.role } : {}),
                ...(data.refreshToken !== undefined ? { refreshToken: data.refreshToken } : {})
            }
        })
        return updatedData
    }

    public async deleteUser(id: number) {
        return await prisma.user.delete({
            where: {
                id
            }
        })
    }

    public async getTokenByUserId(id: number) {
        const user = await prisma.user.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                refreshToken: true,
                role: true
            }
        })

        return user
    }
}

export const authRepository = new AuthRepository()