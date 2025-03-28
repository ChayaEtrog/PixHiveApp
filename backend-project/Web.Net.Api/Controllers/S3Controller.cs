using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Web.Net.Core.InterfaceService;
using Web.Net.Service;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Web.Net.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class S3Controller(IS3Service s3Service,IFileService fileService) : ControllerBase
    {
        private readonly IS3Service _s3Service=s3Service;
        private readonly IFileService _fileService = fileService;


        [HttpGet("upload-url")]
        public async Task<IActionResult> GetUploadUrl([FromQuery] string fileName, [FromQuery] string contentType)
        {
            if (string.IsNullOrEmpty(fileName))
                return BadRequest("Missing file name");

            var result = await _s3Service.GeneratePresignedUrlAsync(fileName, contentType);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, result.ErrorMessage); // מחזיר את השגיאה במקרה של כישלון

            return Ok(new { url = result.Data }); // מחזיר את ה-URL במקרה של הצלחה
        }

        // ⬇️ קבלת URL להורדת קובץ מה-S3
        [HttpGet("download-url/{fileName}")]
        public async Task<IActionResult> GetDownloadUrl(string fileName)
        {
            var result = await _s3Service.GetDownloadUrlAsync(fileName);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, result.ErrorMessage); // מחזיר את השגיאה במקרה של כישלון

            return Ok(new { downloadUrl = result.Data }); // מחזיר את ה-URL במקרה של הצלחה
        }

        [HttpDelete("{fileId}")]
        public async Task<IActionResult> DeleteFile(int fileId)
        {
            Console.WriteLine("fileId"+fileId);
            var files = await _fileService.GetDeletedFilesAsync();
            var file = files.Data.FirstOrDefault(f => f.Id == fileId);
            if (file == null)
            {
                return NotFound("File not found.");
            }

            bool s3Deleted = await _s3Service.DeleteFileAsync(file.Name);
            if (!s3Deleted)
            {
                return StatusCode(500, "Failed to delete file from S3.");
            }

            var dbDeleted = await _fileService.DeleteFileAsync(fileId);
            if (!dbDeleted.IsSuccess)
            {
                return StatusCode(500, "Failed to delete file from the database.");
            }

            return Ok("File deleted successfully.");
        }
    }
}
