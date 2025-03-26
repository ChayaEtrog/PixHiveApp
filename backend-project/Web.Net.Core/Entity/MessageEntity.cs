using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Web.Net.Core.Entity
{
    [Table("Messages")]
    public class MessageEntity
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }

        public string Message { get; set; }

        public DateTime CreatedAt { get; set; }

        public bool IsActive { get; set; }

        public UserEntity User { get; set; }

        public MessageEntity()
        {
            
        }

        public MessageEntity(int id, int userId, string message, DateTime createdAt, bool isActive)
        {
            Id = id;
            UserId = userId;
            Message = message;
            CreatedAt = createdAt==null?DateTime.Now:createdAt;
            IsActive = isActive;
        }
    }
}
