using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Web.Net.Core.Entity
{
    [Table("UserEntityMessageEntity")]
    public class UserEntityMessageEntity
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public UserEntity User { get; set; }

        public int MessageId { get; set; }
        public MessageEntity Message { get; set; }

        public bool IsRead { get; set; }
        public DateTime? ReadAt { get; set; }
    }
}
