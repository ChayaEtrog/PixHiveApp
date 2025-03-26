using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Web.Net.Core.Entity
{
    [Table("Files")]
    public class FileEntity
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }

        public string Name { get; set; }

        public string DisplayName { get; set; }

        public string FilePath { get; set; }

        public int FileSize { get; set; }

        public string Type { get; set; }

        public bool IsDeleted { get; set; }

        public DateTime UploadedAt { get; set; }

        public DateTime UpdateAt { get; set; }

        public UserEntity User { get; set; }
        public List<TagEntity> Tags { get; set; } = new List<TagEntity>(); 
        public List<AlbumEntity> Albums { get; set; } = new List<AlbumEntity>();

        public FileEntity()
        {
            
        }

        public FileEntity(int id, int userId, string name, string filePath, int fileSize, DateTime uploadedAt, DateTime updateAt)
        {
            Id = id;
            UserId = userId;
            Name = name;
            FilePath = filePath;
            FileSize = fileSize;
            UploadedAt = uploadedAt == null ? DateTime.Now : uploadedAt;
            UpdateAt = updateAt == null ? DateTime.Now :updateAt ;
        }
    }
}
