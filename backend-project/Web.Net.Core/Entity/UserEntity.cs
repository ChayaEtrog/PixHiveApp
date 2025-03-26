using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Web.Net.Core.Entity
{
    [Table("Users")]
    public class UserEntity
    {
        [Key]
        public int Id { get; set; }

        public string UserName { get; set; }

        public string Email { get; set; }

        public string PasswordHash { get; set; }

        public DateTime CreatedAt { get; set; }

        public string PhoneNumber { get; set; }

        public List<FileEntity> Files { get; set; } = new List<FileEntity>(); 
        public List<AlbumEntity> Albums { get; set; } = new List<AlbumEntity>(); 
        public List<MessageEntity> Messages { get; set; } = new List<MessageEntity>();
        public List<Role> UserRoles { get; set; }= new List<Role>();
        public UserEntity()
        {
        }

        public UserEntity(int id, string firstName, string lastName, string email, string password, int role, DateTime createdAt, string phoneNumber)
        {
            Id = id;
            UserName = firstName;
            Email = email;
            PasswordHash = password;
            CreatedAt = createdAt == null ? DateTime.Now:createdAt;
            PhoneNumber = phoneNumber;
        }
    }

}
