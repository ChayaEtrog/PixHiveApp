using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Web.Net.Core.Entity
{
    [Table("Albums")]
    public class AlbumEntity
    {
        [Key]
        public int Id { get; set; }

        public string AlbumName { get; set; }

        public DateTime CreatedAt { get; set; }

        public int UserId { get; set; }

        public int? ParentId { get; set; }

        public UserEntity User { get; set; } 
        public List<FileEntity> Files { get; set; } = new List<FileEntity>();

        public AlbumEntity()
        {
            
        }

        public AlbumEntity(int id, string albumName, DateTime createdAt, int userId, UserEntity user)
        {
            Id = id;
            AlbumName = albumName;
            CreatedAt = createdAt == null ? DateTime.Now:createdAt;
            UserId = userId;
            User = user;
        }
    }
}
