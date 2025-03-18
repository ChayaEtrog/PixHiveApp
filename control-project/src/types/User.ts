export class User {
    constructor(
        public id: number,
        public userName: string,
        public email: string,
        public phoneNumber: string,
        public passwordHash:string,
        public createdAt?:Date

    ) { }
}