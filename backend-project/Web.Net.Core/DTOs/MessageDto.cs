using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Web.Net.Core.DTOs
{
    public class MessageDto
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public string Message { get; set; }

        public DateTime CreatedAt { get; set; }

        public bool IsActive { get; set; }
    }
}
