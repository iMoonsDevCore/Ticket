import { authService } from "./AuthService"
import { Request, Response } from "express"
import { userSchema } from "./schema/userSchema"

class AuthController {
    public registerUser = async (req: Request, res: Response) => {
        try {
            const parsedData = userSchema.safeParse(req.body)

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

            res.cookie("refreshToken", user.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            })

            return res.status(200).json({ 
                message: "User logged in successfully",
                token: user.token,
                refreshToken: user.refreshToken,
             })
        } catch (error) {
            res.status(500).json({ message: "Internal server error" })
            console.log(error)
        }
    }

    public refreshToken = async (req: Request, res: Response) => {
        try {
            const refreshTokenFromBody = req.body?.refreshToken
            const cookieHeader = req.headers.cookie || ""
            const refreshTokenFromCookie = cookieHeader
                .split(";")
                .map((cookie) => cookie.trim())
                .find((cookie) => cookie.startsWith("refreshToken="))
                ?.split("=")[1]

            const refreshToken = refreshTokenFromBody || decodeURIComponent(refreshTokenFromCookie || "")

            if (!refreshToken) {
                return res.status(400).json({ message: "Refresh token is required" })
            }

            const newToken = await authService.refreshToken(refreshToken)

            if (!newToken) {
                return res.status(401).json({ message: "Invalid refresh token" })
            }

            res.cookie("refreshToken", newToken.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            })

            return res.status(200).json({
                message: "Token refreshed successfully",
                token: newToken.token,
                refreshToken: newToken.refreshToken
            })
        } catch (error) {
            res.status(500).json({ message: "Internal server error" })
        }
    }

    public logoutUser = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id

            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" })
            }

            const result = await authService.logoutUser(userId)

            if (!result) {
                return res.status(400).json({ message: "Failed to logout user" })
            }

            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/"
            })

            return res.status(200).json({ message: "User logged out successfully" })
        } catch (error) {
            res.status(500).json({ message: "Internal server error" })
        }
    }
}

export const authController = new AuthController()