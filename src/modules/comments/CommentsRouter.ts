import { Router } from "express";
import { verifyRole } from "../middlewares/verifyRole"
import { verifyToken } from "../middlewares/verifyToken"
import { UserRole } from "../user/user.interface"
import { commentController } from "./CommentsController";

export const commentRouter = Router()

commentRouter.get("/", 
     verifyToken,
     verifyRole(UserRole.TECHNICIAN, UserRole.ADMIN),
     commentController.getAllComment
    )
