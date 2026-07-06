import { commentService } from "./CommentsService";
import { Request, Response, NextFunction } from "express"

class CommentController {
    private commentService : typeof commentService

    constructor(){
        this.commentService = commentService
    }

    public getAllComment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const comments = await this.commentService.getAllComments()

            return res.json(200).json({
                success: true,
                comments
            })
        } catch (error) {
            next(error)
        }
    }
}

export const commentController = new CommentController()