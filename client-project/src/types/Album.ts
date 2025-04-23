export type Album = {
    id: number;
    createdAt:Date;
    albumName: string
    userId: number
    parentId: number;
}

export const emptyAlbum:Album={id:-1, createdAt:new Date(),albumName:'', userId:-1, parentId:-1}