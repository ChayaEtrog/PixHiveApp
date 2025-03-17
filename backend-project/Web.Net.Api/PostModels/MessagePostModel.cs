namespace Web.Net.Api.PostModels
{
    public class MessagePostModel
    {
        public int UserId { get; set; }

        public string Message { get; set; }

        public bool IsActive { get; set; }
    }
}
