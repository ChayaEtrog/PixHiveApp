export class Message {
    constructor(
        public id: number,
        public message: string,
        public senderId:number,
        public isActive: boolean,
        public receiverId:null|number,
        public createdAt?:Date,
    ) { }
}
