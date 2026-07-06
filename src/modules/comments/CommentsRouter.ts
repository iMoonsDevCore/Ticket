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

commentRouter.post("/created/:id", 
     verifyToken,
     verifyRole(UserRole.USER, UserRole.TECHNICIAN, UserRole.ADMIN),
     commentController.createComment
)

commentRouter.put("/edit/:id",
     verifyToken,
     verifyRole(UserRole.USER, UserRole.TECHNICIAN, UserRole.ADMIN),
     commentController.updateComment
)

commentRouter.delete("/:id",
     verifyToken,
     verifyRole(UserRole.USER, UserRole.TECHNICIAN, UserRole.ADMIN),
     commentController.deleteComment
)