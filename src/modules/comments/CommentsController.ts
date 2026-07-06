import { commentService } from "./CommentsService";
import { Request, Response, NextFunction } from "express"

class CommentController {
    private commentService: typeof commentService

    constructor() {
        this.commentService = commentService
    }

    public getAllComment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const comments = await this.commentService.getAllComments()

            return res.status(200).json({
                success: true,
                comments
            })
        } catch (error) {
            next(error)
            res.status(500)
        }
    }

    public createComment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params as { id: string }
            const userId = req.user?.id
            const { content } = req.body

            if (!userId) {
                return
            }

            const createdComment = await this.commentService.createComment({
                ticketId: id,
                userId,
                content
            })

            return res.status(200).json({
                success: true,
                createdComment
            })
        } catch (error) {
            next(error)
            res.status(500)
        }
    }

    public updateComment = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { id } = req.params as { id: string }
            const userId = req.user?.id
            const { content } = req.body

            if (!userId) {
                return
            }

            const updatedComment = await this.commentService.updateComment(
                id,
                userId,
                content
            )

            return res.status(200).json({
                success: true,
                updatedComment
            })
        } catch (error) {
            next(error)
            res.status(500)
        }
    }

    public deleteComment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params as { id: string }

            console.log(typeof id)
            const deletedComment = await this.commentService.deleteComment(id)

            return res.status(200).json({
                success: true,
                deletedComment
            })
        } catch (error) {
            next(error)
        }
    }
}

export const commentController = new CommentController()