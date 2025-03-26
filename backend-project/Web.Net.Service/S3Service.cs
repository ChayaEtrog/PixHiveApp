using Amazon.S3.Model;
using Amazon.S3;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Web.Net.Core.InterfaceService;
using Web.Net.Core.Shared;

namespace Web.Net.Service
{
    public class S3Service:IS3Service
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;

        public string BucketName()
        {
            return _bucketName;
        }

        public S3Service(IConfiguration configuration)
        {
            var accessKey = configuration["AWS:AccessKey"];
            var secretKey = configuration["AWS:SecretKey"];
            var region = configuration["AWS:Region"];
            _bucketName = configuration["AWS:BucketName"];

            if (string.IsNullOrEmpty(accessKey) || string.IsNullOrEmpty(secretKey) ||
                string.IsNullOrEmpty(region) || string.IsNullOrEmpty(_bucketName))
            {
                throw new ArgumentException("One or more AWS settings are missing in appsettings.json.");
            }

            _s3Client = new AmazonS3Client(accessKey, secretKey, Amazon.RegionEndpoint.GetBySystemName(region));
        }

        public async Task<Result<string>> GeneratePresignedUrlAsync(string fileName, string contentType)
        {
            try
            {
                var request = new GetPreSignedUrlRequest
                {
                    BucketName = _bucketName,
                    Key = fileName,
                    Verb = HttpVerb.PUT,
                    Expires = DateTime.UtcNow.AddMinutes(10),
                    ContentType = contentType
                };

                var url = _s3Client.GetPreSignedURL(request);

                return Result<string>.Success(url); // Success response with the URL
            }
            catch (Exception ex)
            {
                return Result<string>.Failure($"Error generating presigned URL: {ex.Message}");
            }
        }

        public async Task<Result<string>> GetDownloadUrlAsync(string fileName)
        {
            try
            {
                var request = new GetPreSignedUrlRequest
                {
                    BucketName = _bucketName,
                    Key = fileName,
                    Verb = HttpVerb.GET,
                    Expires = DateTime.UtcNow.AddMinutes(30) // תוקף של 30 דקות
                };

                string url = _s3Client.GetPreSignedURL(request);

                return Result<string>.Success(url); // Success response with the URL
            }
            catch (Exception ex)
            {
                return Result<string>.Failure($"Error generating download URL: {ex.Message}");
            }
        }
    }

}
