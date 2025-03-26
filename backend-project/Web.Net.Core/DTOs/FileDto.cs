using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Web.Net.Core.DTOs
{
    public class FileDto
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public string Name { get; set; }

        public string DisplayName { get; set; }

        public string FilePath { get; set; }

        public string Type { get; set; }

        public int FileSize { get; set; }

        public bool IsDeleted { get; set; }

        public DateTime UploadedAt { get; set; }

        public DateTime UpdateAt { get; set; }
    }
}
