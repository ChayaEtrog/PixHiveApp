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

        public string Message { get; set; }

        public DateTime CreatedAt { get; set; }

        public bool IsActive { get; set; }


        public int SenderId { get; set; }
        public UserEntity Sender { get; set; }

        public int? ReceiverId { get; set; }
        public UserEntity? Receiver { get; set; } 

        public ICollection<UserEntityMessageEntity> UserMessages { get; set; }

        public MessageEntity()
        {
            
        }

        public MessageEntity(int id, int userId, string message, DateTime createdAt, bool isActive,int?reciverId)
        {
            Id = id;
            SenderId = userId;
            Message = message;
            CreatedAt = createdAt==null?DateTime.Now:createdAt;
            IsActive = isActive;
            reciverId = reciverId;
        }
    }
}
