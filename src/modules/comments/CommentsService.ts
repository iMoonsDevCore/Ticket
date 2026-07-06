import { commentRepository } from "./CommentsRepository";
import { internal, notFound } from "../helpers/AppError"
import { CreateCommentDTO } from "./dto/CommentDTO";

class CommentService {
    private commentRepository: typeof commentRepository

    constructor() {
        this.commentRepository = commentRepository
    }

    public getAllComments = async () => {
            try {
                const allComments = await this.commentRepository.getAllComments()

                if(!allComments){
                    return false
                }

                return allComments
            } catch (error: any) { // ← relanza errores conocidos
                throw notFound("No existen commentarios")
            }
        }

    public getCommentByTicketId = async (ticketId: string) => {
        try {
            const comments = await this.commentRepository.getAllCommentsByTicketId(ticketId)

            if (!comments.length) {
                throw notFound("No existen comentarios en este ticket")
            }

            return comments
        } catch (error) {

        }
    }

    public createComment = async (data: CreateCommentDTO) => {
        try {
            const createdTicket = await this.commentRepository.createComment(
                data.ticketId,
                data.userId,
                data.content
            )

            if (!createdTicket) {
                throw internal("Error al crear el comentario")
            }

            return createdTicket
        } catch (error: any) {
            throw internal(error)
        }
    }

    public updateComment = async (id: string, userId: number, content: string) => {
        try {
            const updatedComment = await this.commentRepository.updateComment(id, userId, content)

            if(!updatedComment){
                throw notFound("Error al actualizar el mensaje")
            }

            return updatedComment
        } catch (error) {
            throw internal("Error critico al actualizar el mensaje")
        }
    }

    public deleteComment = async (id: string) => {
        try {
            const deletedComment = await this.commentRepository.deleteCommnet(id)

            return deletedComment
        } catch (error) {
            console.log(error)
            throw internal("Error al borrar el comentario")
        }
    }
}

export const commentService = new CommentService()