export class UserGrowth {
    constructor(
        public year: number,
        public month: number,
        public userCount: number
    ) { }
}

export class UserStatisticsDto
{
    constructor(
    public  userId:number,
    public  username:string,
    public  albumCount:number,
    public  fileCount:number
    ){}
}

export class SystemStatisticsDto
{
    constructor(
    public  totalUsers:number,
    public  totalAlbums:number,
    public  totalFiles:number
    ){}
}