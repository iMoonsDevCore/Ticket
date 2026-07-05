import z from "zod"
import { authService } from "./AuthService"
import { Request, Response } from "express"
import { userSchema } from "./schema/userSchema"
import { loginSchema } from "./schema/loginSchema"
import { jwtHelpers } from "../helpers/jwt"

class AuthController {
    public registerUser = async (req: Request, res: Response) => {
        try {
            const parsedData = userSchema.safeParse(req.body)

            console.log(parsedData)

            if (!parsedData.success) {
                return res.status(400).json({ message: parsedData.error })
            }

            const createdUser = await authService.registerUser(parsedData.data)

            if (!createdUser) {
                return res.status(400).json({ message: "User already exists" })
            }

            return res.status(201).json({ message: "User registered successfully", user: createdUser })
        } catch (error) {
            res.status(500).json({ message: "Internal server error" })
        }
    }

    public loginUser = async (req: Request, res: Response) => {
        try {

            const { password, email } = req.body
            
            const user = await authService.loginUser({
                email,
                password
            })

            if (!user) {
                return res.status(400).json({ message: "Invalid email or password" })
            }

            return res.status(200).json({ 
                message: "User logged in successfully",
                token: user.token,
             })
        } catch (error) {
            res.status(500).json({ message: "Internal server error" })
            console.log(error)
        }
    }
}

export const authController = new AuthController()