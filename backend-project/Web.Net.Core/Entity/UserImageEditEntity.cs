using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Web.Net.Core.Entity
{
    [Table("UserImageEdit")]
    public class UserImageEditEntity
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }

        public int EditCount { get; set; } = 0;
    }
}
