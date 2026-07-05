import prisma from "../../config/prisma"
import {env} from "../../config/env"
import { User } from "../user/user.interface"
import { UserDTO } from "@/modules/user/userDTO"
import bcrypt from "bcryptjs"

class AuthService {
    public static findUser = async (email: string) => {
        const find = await prisma.user.findUnique({
            where: {
                email
            }
        })

        return find
    }

    public static registerUser = async (data: UserDTO) => {
        try {

            const hashed = await bcrypt.hash(data.password, env.HASH_SALT)
            const createdData = await prisma.user.create({
                data: {
                    ...data,
                    password: hashed
                }
                
            })

            return createdData
        } catch (error: any) {
            console.log(error)
        }
    }
}