using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Web.Net.Core.DTOs
{
    public class AlbumDto
    {
        public int Id { get; set; }

        public string AlbumName { get; set; }

        public DateTime CreatedAt { get; set; }

        public int UserId { get; set; }

        public int? ParentId { get; set; }
    }
}
