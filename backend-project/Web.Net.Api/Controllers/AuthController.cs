using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Web.Net.Api.PostModels;
using Web.Net.Core.DTOs;
using Web.Net.Core.InterfaceService;
using Web.Net.Service;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Web.Net.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(IAuthService authService, IMapper mapper) : ControllerBase
    {
        private readonly IAuthService _authService = authService;
        private readonly IMapper _mapper = mapper;

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginModel model)
        {
            var result = _authService.Login(model.UserNameOrEmail, model.Password);
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            return Unauthorized(result.ErrorMessage);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserPostModel user)
        {
            if (user == null)
                return BadRequest("User data is required.");

            var userDto = _mapper.Map<UserDto>(user);
            var result = await _authService.Register(userDto);
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            return BadRequest(result.ErrorMessage);
        }

        //[Authorize]
        [HttpPost("upgrade-to-admin/{userId}")]
        public async Task<IActionResult> UpgradeToAdmin(int userId,[FromBody] UpgradeToAdminRequest request)
        {
            var result = await _authService.UpgradeToAdmin(userId, request.Password);
            if (!result.IsSuccess)
            {
                return BadRequest(result.ErrorMessage);
            }

            return Ok(result.Data);
        }

        public class UpgradeToAdminRequest
        {
            public string Password { get; set; }
        }
    }
}
