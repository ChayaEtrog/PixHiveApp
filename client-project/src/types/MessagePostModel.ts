export type MessagePostModel = {
    senderId: number;
    message: string
    isActive: boolean
    receiverId: number|null;
}
