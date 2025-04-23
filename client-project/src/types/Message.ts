export type Message = {
    id: number;
    createdAt:Date;
    message: string
    userId: number
    isRead: boolean;
}