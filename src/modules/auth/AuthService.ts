import { env } from "../../config/env"
import { UserDTO } from "@/modules/user/userDTO"
import { UserLoginDTO } from "./dto/UserLoginDTO"
import { UserRole } from "../user/user.interface"
import { authRepository } from "./AuthRepository"
import bcrypt from "bcryptjs"
import { jwtHelpers } from "../helpers/jwt"
import { createHash, timingSafeEqual } from "crypto"

class AuthService {

    private authRepository: typeof authRepository

    constructor() {
        this.authRepository = authRepository
    }

    private hashToken = (token: string) => {
        return createHash("sha256").update(token).digest("hex")
    }

    private compareTokens = (storedToken: string, incomingToken: string) => {
        const storedBuffer = Buffer.from(storedToken)
        const incomingBuffer = Buffer.from(incomingToken)

        if (storedBuffer.length !== incomingBuffer.length) {
            return false
        }

        return timingSafeEqual(storedBuffer, incomingBuffer)
    }

    private compareAgainstStoredHash = (storedToken: string, incomingToken: string) => {
        const incomingHash = this.hashToken(incomingToken)
        const storedBuffer = Buffer.from(storedToken)
        const incomingBuffer = Buffer.from(incomingHash)

        if (storedBuffer.length !== incomingBuffer.length) {
            return false
        }

        return timingSafeEqual(storedBuffer, incomingBuffer)
    }
    
    public static findUser = async (email: string) => {
        const find = await authRepository.findUser(email)

        if(!find){
            return false
        }

        return find
    }

    public refreshToken = async (refreshToken: string) => {
        try {
            const decoded = jwtHelpers.verifyRefreshToken(refreshToken) as { id?: number; role?: UserRole }

            if (!decoded || typeof decoded.id !== "number") {
                return false
            }

            const user = await authRepository.getTokenByUserId(decoded.id)

            if (!user || !user.refreshToken) {
                return false
            }

            const storedRefreshToken = user.refreshToken
            const storedPayload = jwtHelpers.verifyRefreshToken(refreshToken) as { id?: number; role?: UserRole }

            if (!storedPayload || storedPayload.id !== decoded.id) {
                await authRepository.updateUser(decoded.id, { refreshToken: null })
                return false
            }

            const isValidRefreshToken = this.compareTokens(storedRefreshToken, refreshToken) || this.compareAgainstStoredHash(storedRefreshToken, refreshToken)

            if (!isValidRefreshToken) {
                await authRepository.updateUser(decoded.id, { refreshToken: null })
                return false
            }

            const role = user.role ?? decoded.role ?? storedPayload.role ?? UserRole.USER
            const newToken = jwtHelpers.generateToken({ id: decoded.id, role })

            return { token: newToken, refreshToken }
        } catch (error: any) {
            console.error("Error refreshing token:", error)
            return false
        }
    }

    public registerUser = async (data: UserDTO) => {
        try {

            const existingUser = await authRepository.findUser(data.email)

            if (existingUser) {
                return false
            }

            const hashed = await bcrypt.hash(data.password, 10)

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
            const hashedRefreshToken = this.hashToken(refreshToken)

            await authRepository.updateUser(user.id, { refreshToken: hashedRefreshToken })

            return { token, refreshToken }
        } catch (error) {
            console.error("Error occurred while logging in user:", error)
            return false
        }
    }

    public async logoutUser(userId: number){
        try {
            const updatedUser = await authRepository.updateUser(userId, { refreshToken: null })

            return !!updatedUser
        } catch (error: any) {
            console.log(error)
            return false
        }
    }
}

export const authService = new AuthService()