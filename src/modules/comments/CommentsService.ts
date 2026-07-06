import { commentRepository } from "./CommentsRepository";
import { internal, notFound } from "../helpers/AppError"
import { CreateCommentDTO } from "./dto/CommentDTO";

class CommentService {
    private commentRepository : typeof commentRepository

    constructor(){
        this.commentRepository = commentRepository
    }

    public getAllComments = async () => {
        try {
            const allComments = await this.commentRepository.getAllComments()

            if(!allComments.length){
                throw notFound("No existen comentarios")
            }

            return allComments
        } catch (error) {
            throw internal("Error critico del servidor")
        }
    }

    public getCommentByTicketId = async (ticketId: string) => {
        try {
            const comments = await this.commentRepository.getAllCommentsByTicketId(ticketId)

            if(!comments.length){
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

            if(!createdTicket){
                throw internal("Error al crear el comentario")
            }

            return createdTicket
        } catch (error: any) {
            throw internal(error)
        }
    }

    public deleteComment = async (id: number) => {
        try {
            const deletedComment = await this.commentRepository.deleteCommnet(id)

            return deletedComment
        } catch (error) {
            throw internal("Error al borrar el comentario")
        }
    }
}

export const commentService = new CommentService()