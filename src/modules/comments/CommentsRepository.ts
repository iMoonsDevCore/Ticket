import prisma from "../../config/prisma"

class CommentsRepository {
    public async getAllComments() {
        return await prisma.comment.findMany()
    }

    public async getAllCommentsByTicketId(ticketId: string) {
        return await prisma.comment.findMany({
            where: {
                ticketId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })
    }

    public async createComment(ticketId: string, userId: number, content: string) {
        return await prisma.comment.create({
            data: {
                ticketId,
                userId,
                content
            }
        })
    }

    public async updateComment(id: string, userId: number, content: string) {

        return await prisma.comment.update({
            where: { id },
            data: { content }
        })
    }

    public async deleteCommnet(id: string) {
        return await prisma.comment.delete({
            where: {
                id
            }
        })
    }
}

export const commentRepository = new CommentsRepository()