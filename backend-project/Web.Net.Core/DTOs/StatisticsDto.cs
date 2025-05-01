using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Web.Net.Core.DTOs
{
    public class UserStatisticsDto
    {
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public int AlbumCount { get; set; }
        public int FileCount { get; set; }
        public double UsedMegabytes { get; set; }
        
    }

    public class SystemStatisticsDto
    {
        public int TotalUsers { get; set; }
        public int TotalAlbums { get; set; }
        public int TotalFiles { get; set; }
    }
}
