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
    public class UserController(IUserService userService, IMapper mapper) : ControllerBase
    {
        private readonly IUserService _userService = userService;
        private readonly IMapper _mapper = mapper;

        // GET: api/<UserController>
        [HttpGet]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult> Get()
        {
            var result = await _userService.GetUsersAsync();
            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, result.ErrorMessage);

            return Ok(result.Data);
        }

        // GET api/<UserController>/5
        [HttpGet("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult> Get(int id)
        {
            var result = await _userService.GetUserByIdAsync(id);
            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, result.ErrorMessage);

            return result.Data == null ? NotFound() : Ok(result.Data);
        }

        // POST api/<UserController>
        [HttpPost]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult> Post([FromBody] UserPostModel user)
        {
            var entityDto = _mapper.Map<UserDto>(user);
            var result = await _userService.AddUserAsync(entityDto);
            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, result.ErrorMessage);

            return Ok(result.Data);
        }

        // PUT api/<UserController>/5
        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult> Put(int id, [FromBody] UserPostModel user)
        {
            var entityDto = _mapper.Map<UserDto>(user);
            var result = await _userService.UpdateUserAsync(id, entityDto);
            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, result.ErrorMessage);

            return result.Data == null ? NotFound() : Ok(result.Data);
        }

        // DELETE api/<UserController>/5
        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult> Delete(int id)
        {
            var result = await _userService.DeleteUserAsync(id);
            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, result.ErrorMessage);

            return NoContent();
        }

        [HttpGet("growth")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult<IEnumerable<UserGrowthDto>>> GetUserGrowthByMonth()
        {
            var result = await _userService.GetUserGrowthByMonth();

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, result.ErrorMessage);

            return Ok(result.Data);
        }
    }
}
