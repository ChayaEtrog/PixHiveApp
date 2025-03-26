export type Image = {
    id: number;
    userId: number
    name: string
    displayName: string
    FilePath: string
    fileSize: number;
    type: string;
    uploadedAt: Date;
    updateAt: Date
}

export const emptyImage:Image={
    id: -1,
    userId: -1,
    name: '',
    displayName: '',
    FilePath: '',
    fileSize: 0,
    type: '',
    uploadedAt: new Date(),
    updateAt: new Date()
}