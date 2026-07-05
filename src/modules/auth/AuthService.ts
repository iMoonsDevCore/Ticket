import prisma from "../../config/prisma"
import { env }  from "../../config/env"
import { UserDTO } from "@/modules/user/userDTO"
import { UserLoginDTO } from "./dto/UserLoginDTO"
import { UserRole } from "../user/user.interface"
import { authRepository } from "./AuthRepository"
import bcrypt from "bcryptjs"
import { jwtHelpers } from "../helpers/jwt"

class AuthService {

    private authRepository: typeof authRepository

    constructor() {
        this.authRepository = authRepository
    }
    
    public static findUser = async (email: string) => {
        const find = await authRepository.findUser(email)

        if(!find){
            return false
        }

        return find
    }

    public refreshToken = async (userId: number) => {
        try {
            const user = await authRepository.getTokenByUserId(userId)

            if (!user || !user.refreshToken) {
                return false
            }

            const decoded = jwtHelpers.verifyRefreshToken(user.refreshToken)

            if (!decoded) {
                return false
            }

            const newToken = jwtHelpers.generateToken({ id: userId, role: (decoded as any).role })

            await authRepository.updateUser(userId, { refreshToken: user.refreshToken })

            return { token: newToken, refreshToken: user.refreshToken }
        } catch (error: any) {
            console.log(error)
        }
    }

    public registerUser = async (data: UserDTO) => {
        try {

            const existingUser = await authRepository.findUser(data.email)

            if (existingUser) {
                return false
            }

            const hashed = await bcrypt.hash(data.password, env.HASH_SALT)

            const createdData = await authRepository.registerUser({
                email: data.email,
                username: data.username,
                password: hashed,
                role: UserRole.USER
            })   

            return createdData

        } catch (error: any) {
            console.log(error)
        }
    }

    public loginUser = async (data: UserLoginDTO) => {
        try {
            const user = await authRepository.findUser(data.email)

            if (!user) {
                return false
            }

            const isPasswordValid = await bcrypt.compare(data.password, user.password)

            if (!isPasswordValid) {
                return false
            }

            
            const token = jwtHelpers.generateToken({ id: user.id, role: user.role })
            const refreshToken = jwtHelpers.generateRefreshToken({ id: user.id, role: user.role })

            await authRepository.updateUser(user.id, { refreshToken })

            return { token, refreshToken }
        } catch (error) {
            console.error("Error occurred while logging in user:", error)
            return false
        }
    }
}

export const authService = new AuthService()