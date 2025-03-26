namespace Web.Net.Api.PostModels
{
    public class AlbumPostModel
    {
        public string AlbumName { get; set; }

        public int UserId { get; set; }

        public int ? ParentId { get; set; }
    }
}
