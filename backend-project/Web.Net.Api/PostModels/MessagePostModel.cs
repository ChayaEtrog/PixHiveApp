namespace Web.Net.Api.PostModels
{
    public class MessagePostModel
    {
        public int SenderId { get; set; }

        public string Message { get; set; }

        public bool IsActive { get; set; }

        public int? ReceiverId { get; set; }

    }
}
