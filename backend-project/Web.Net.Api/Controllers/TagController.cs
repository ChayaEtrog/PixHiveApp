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
    public class TagController(ITagService tagService, IMapper mapper) : ControllerBase
    {
        private readonly ITagService _tagService = tagService;
        private readonly IMapper _mapper = mapper;
        
        // GET: api/<TagController>
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            var result = await _tagService.GetTagsAsync();
            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, result.ErrorMessage);

            return Ok(result.Data);
        }

        // GET api/<TagController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            var result = await _tagService.GetTagByIdAsync(id);
            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, result.ErrorMessage);

            return result.Data == null ? NotFound() : Ok(result.Data);
        }

        // POST api/<TagController>
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] TagPostModel tag)
        {
            var entityDto = _mapper.Map<TagDto>(tag);
            var result = await _tagService.AddTagAsync(entityDto);
            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, result.ErrorMessage);

            return Ok(result.Data);
        }

        // PUT api/<TagController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] string newName)
        {
            var result = await _tagService.UpdateTagAsync(id, newName);
            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, result.ErrorMessage);

            return result.Data == null ? NotFound() : Ok(result.Data);
        }

        [HttpGet("{fileId}/unassigned-tags")]
        public async Task<ActionResult<IEnumerable<TagDto>>> GetUnassignedTags(int fileId)
        {
            var result = await _tagService.GetUnassignedTagsAsync(fileId);
            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, result.ErrorMessage);

            return Ok(result.Data);
        }
    }
}
