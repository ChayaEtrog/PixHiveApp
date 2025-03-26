using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Web.Net.Core.Shared;

namespace Web.Net.Core.InterfaceService
{
    public interface IS3Service
    {
        Task<Result<string>> GeneratePresignedUrlAsync(string fileName, string contentType);

        Task<Result<string>> GetDownloadUrlAsync(string fileName);

        public string BucketName();
    }
}
