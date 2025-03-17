using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Web.Net.Core.Entity
{
    [Table("Tags")]
    public class TagEntity
    {
        [Key]
        public int Id { get; set; }

        public string TagName { get; set; }

        public List<FileEntity> Files { get; set; } = new List<FileEntity>();

        public TagEntity()
        {
            
        }

        public TagEntity(int id, string tagName)
        {
            Id = id;
            TagName = tagName;
        }
    }
}
