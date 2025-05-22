using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Web.Net.Core.InterfaceService;
using Web.Net.Service;

namespace Web.Net.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserImageEditCountController(IUserImageEditCountService imageEditCountService) : ControllerBase
    {
        private readonly IUserImageEditCountService _imageEditCountService = imageEditCountService;

        [HttpGet("{userId}/count")]
        public async Task<IActionResult> GetEditCountAsync(int userId)
        {
            var result = await _imageEditCountService.GetEditCountAsync(userId);

            if (result.IsSuccess)
                return Ok(result.Data);

            return Ok(result.Data);
        }

        [HttpPost("{userId}/increment")]
        public async Task<IActionResult> IncrementEditCountAsync(int userId)
        {
            var result = await _imageEditCountService.IncrementEditCountAsync(userId);

            if (result.IsSuccess)
                return Ok(result.Data);

            return BadRequest(result.ErrorMessage);
        }
    }
}
