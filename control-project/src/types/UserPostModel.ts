export class UserPostModel {
    constructor(
        public userName: string,
        public email: string,
        public phoneNumber: string,
        public PasswordHash: string
    ) { }
}