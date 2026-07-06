export interface CreateCommentDTO {
  ticketId: string;
  userId: number
  content: string;
}

export interface UpdateCommentDTO {
  content: string;
}
