namespace Web.Net.Api.PostModels
{
    public class UserPostModel
    {

        public string UserName { get; set; }

        public string Email { get; set; }

        public string PhoneNumber { get; set; }

        public string ? PasswordHash { get; set; }
    }
}
