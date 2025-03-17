using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Web.Net.Core.DTOs
{
    public class UserDto
    {
        public int Id { get; set; }

        public string UserName { get; set; }

        public string Email { get; set; }

        public string PasswordHash { get; set; }

        public DateTime CreatedAt { get; set; }

        public string PhoneNumber { get; set; }
    }
}
