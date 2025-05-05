using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Web.Net.Core.Entity;

namespace Web.Net.Core.DTOs
{
    public class MessageDto
    {
        public int Id { get; set; }

        public string Message { get; set; }

        public DateTime CreatedAt { get; set; }

        public bool IsActive { get; set; }

        public bool IsRead { get; set; }

        public int SenderId { get; set; }

        public int? ReceiverId { get; set; }
    }
}
