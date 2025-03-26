using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Web.Net.Api.PostModels;
using Web.Net.Core.DTOs;
using Web.Net.Core.InterfaceService;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Web.Net.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AlbumController(IAlbumService albumService, IMapper mapper) : ControllerBase
    {
        private readonly IAlbumService _albumService=albumService;
        private readonly IMapper _mapper=mapper;

        // GET: api/<AlbumController>
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            var result = await _albumService.GetAlbumsAsync();
            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, result.ErrorMessage);

            return Ok(result.Data);
        }

        // GET api/<AlbumController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            var result = await _albumService.GetAlbumByIdAsync(id);
            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, result.ErrorMessage);

            return result.Data == null ? NotFound() : Ok(result.Data);
        }

        // POST api/<AlbumController>
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] AlbumPostModel album)
        {
            var entityDto = _mapper.Map<AlbumDto>(album);
            var result = await _albumService.AddAlbumAsync(entityDto);
            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, result.ErrorMessage);

            return Ok(result.Data);
        }

        // PUT api/<AlbumController>/5
        [HttpPut("{id}/album-of/{userId}")]
        public async Task<ActionResult> Put(int id, int userId, [FromBody] string albumName)
        {
            var result = await _albumService.UpdateAlbumAsync(userId, id, albumName);
            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, result.ErrorMessage);

            return result.Data == null ? NotFound() : Ok(result.Data);
        }

        // DELETE api/<AlbumController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var result = await _albumService.GetAlbumByIdAsync(id);
            if (!result.IsSuccess || result.Data == null)
            {
                return NotFound();
            }

            await _albumService.DeleteAlbumAsync(id);
            return NoContent();
        }

        [HttpPost("{albumId}/add-file/{fileId}")]
        public async Task<IActionResult> AddFileToAlbum(int albumId, int fileId)
        {
            var result = await _albumService.AddFileToAlbumAsync(albumId, fileId);
            if (!result.IsSuccess)
            {
                return NotFound("Album or File not found.");
            }

            return Ok("File added to album successfully.");
        }

        [HttpGet("{albumId}/files")]
        public async Task<IActionResult> GetFilesByAlbum(int albumId)
        {
            var result = await _albumService.GetFilesByAlbumIdAsync(albumId);

            if (!result.IsSuccess)
            {
                return StatusCode(result.StatusCode, result.ErrorMessage);
            }

            return Ok(result.Data);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetAlbumsByUser(int userId)
        {
            var result = await _albumService.GetAlbumsByUserIdAsync(userId);

            if (!result.IsSuccess)
            {
                return StatusCode(result.StatusCode, result.ErrorMessage); ;
            }

            return Ok(result.Data);
        }

        [HttpGet("children-of-album/{parentId}/by-user/{userId}")]
        public async Task<IActionResult> GetChildAlbums(int userId,  int parentId)
        {
            int? nullableParentId = parentId == -1 ? null : parentId;

            var result = await _albumService.GetChildAlbumsAsync(userId, nullableParentId);
            if (result.IsSuccess)
                return Ok(result.Data);

            return StatusCode(result.StatusCode, result.ErrorMessage);
        }
    }
}
