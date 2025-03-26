export class Message {
    constructor(
        public id: number,
        public message: string,
        public isActive: boolean,
        public createdAt?:Date

    ) { }
}