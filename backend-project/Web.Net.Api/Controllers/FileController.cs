using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Web.Net.Api.PostModels;
using Web.Net.Core.DTOs;
using Web.Net.Core.InterfaceService;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Web.Net.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FileController(IFileService fileService, IMapper mapper) : ControllerBase
    {
        private readonly IFileService _fileService = fileService;
        private readonly IMapper _mapper = mapper;

        // GET: api/<FileController>
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            var result = await _fileService.GetFilesAsync();
            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, result.ErrorMessage);

            return Ok(result.Data);
        }

        // GET api/<FileController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            var result = await _fileService.GetFileByIdAsync(id);
            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, result.ErrorMessage);

            return result.Data == null ? NotFound() : Ok(result.Data);
        }

        // POST api/<FileController>
        [HttpPost("to-album/{albumId}")]
        public async Task<ActionResult> Post([FromBody] FilePostModel file,int albumId)
        {
            var entityDto = _mapper.Map<FileDto>(file);
            if (file == null)
                return NotFound("no file was send");
            var result = await _fileService.AddFileAsync(entityDto,albumId);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, result.ErrorMessage);

            return Ok(result.Data);
        }

        // PUT api/<FileController>/5
        [HttpPut("{id}/file-of/{userId}")]
        public async Task<ActionResult> Put(int id, int userId, [FromBody] string newName)
        {
            var result = await _fileService.UpdateFileAsync(userId, id, newName);
            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, result.ErrorMessage);

            return result.Data == null ? NotFound() : Ok(result.Data);
        }

        // DELETE api/<FileController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var result = await _fileService.GetFileByIdAsync(id);
            if (!result.IsSuccess || result.Data == null)
            {
                return NotFound();
            }

            await _fileService.DeleteFileAsync(id);
            return NoContent();
        }

        [HttpGet("by-tag-and-user/{userId}/{tagName}")]
        public async Task<ActionResult<IEnumerable<FileDto>>> GetFilesByTagAndUserId(int userId, string tagName)
        {
            var result = await _fileService.GetFilesByTagAndUserIdAsync(userId, tagName);

            if (!result.IsSuccess || result.Data == null || !result.Data.Any())
            {
                return NotFound();
            }

            return Ok(result.Data);
        }

        [HttpGet("by-date")]
        public async Task<IActionResult> GetFilesByDate([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var result = await _fileService.GetFilesByDateAsync(startDate, endDate);
            if (!result.IsSuccess || result.Data == null || !result.Data.Any())
            {
                return NotFound("No files found for the given date range.");
            }
            return Ok(result.Data);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetFilesByUser(int userId)
        {
            var result = await _fileService.GetFilesByUserIdAsync(userId);

            if (!result.IsSuccess)
            {
                return StatusCode(result.StatusCode, result.ErrorMessage);
            }

            return Ok(result.Data);
        }

        [HttpPost("{fileId}/tags/{tagId}")]
        public async Task<IActionResult> AddTagToFile(int fileId, int tagId)
        {
            var result = await _fileService.AddTagToFileAsync(fileId, tagId);
            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, result.ErrorMessage);

            return Ok("Tag added successfully.");
        }

        [HttpDelete("{fileId}/tags/{tagId}")]
        public async Task<IActionResult> RemoveTagFromFile(int fileId, int tagId)
        {
            var result = await _fileService.RemoveTagFromFileAsync(fileId, tagId);
            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, result.ErrorMessage);

            return Ok("Tag removed successfully.");
        }

        [HttpGet("{fileId}/tags")]
        public async Task<ActionResult<IEnumerable<TagDto>>> GetTagsByFile(int fileId)
        {
            var result = await _fileService.GetTagsByFileIdAsync(fileId);

            if (!result.IsSuccess || result.Data == null || !result.Data.Any())
                return NotFound("No tags to this file.");

            return Ok(result.Data);
        }

        [HttpGet("{userId}/root-files")]
        public async Task<ActionResult<IEnumerable<TagDto>>> GetRootFilesByUserId(int userId)
        {
            var result = await _fileService.GetRootFilesByUserIdAsync(userId);

            if (!result.IsSuccess)
                return NotFound("No tags to this file.");

            return Ok(result.Data);
        }

        [HttpDelete("{fileId}/albums/{albumId}")]
        public async Task<IActionResult> RemoveFileFromAlbum(int fileId, int albumId)
        {
            var result = await _fileService.RemoveFileFromAlbumAsync(fileId, albumId);

            if (!result.IsSuccess)
                return BadRequest(new { message = result.ErrorMessage });

            return Ok(result.Data); 
        }

        [HttpGet("deleted")]
        public async Task<IActionResult> GetDeletedFiles()
        {
            var result = await _fileService.GetDeletedFilesAsync();

            if (!result.IsSuccess)
                return NotFound(new { message = result.ErrorMessage });

            return Ok(result.Data);
        }

        [HttpPost("recycle/{fileId}")]
        public async Task<IActionResult> RecycleFile(int fileId)
        {
            var result = await _fileService.RecycleFile(fileId);
            return result.IsSuccess ? Ok(result.Data) : NotFound(result.ErrorMessage);
        }
    }
}
