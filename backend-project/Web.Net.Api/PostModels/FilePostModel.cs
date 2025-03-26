namespace Web.Net.Api.PostModels
{
    public class FilePostModel
    {
        public int UserId { get; set; }

        public string Name { get; set; }

        public string FilePath { get; set; }

        public int FileSize { get; set; }

        public string Type { get; set; }

        public DateTime UpdateAt { get; set; }
    }
}
