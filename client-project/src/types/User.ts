export type User = {
    id: number,
    userName: String,
    email: String,
    phoneNumber?: string,
    passwordHash?: String,
}

export type UserPostModal = {
    userName: string,
    email: string,
    phoneNumber: string
}