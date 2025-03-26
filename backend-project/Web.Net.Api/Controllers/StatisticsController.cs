using Microsoft.AspNetCore.Mvc;
using Web.Net.Core.DTOs;
using Web.Net.Core.InterfaceService;
using Web.Net.Core.Shared;
using Web.Net.Service;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Web.Net.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatisticsController : ControllerBase
    {
        private readonly IStatisticsService _statisticsService;

        public StatisticsController(IStatisticsService statisticsService)
        {
            _statisticsService = statisticsService;
        }

        [HttpGet("user-statistics")]
        public async Task<ActionResult<Result<IEnumerable<UserStatisticsDto>>>> GetUserStatistics()
        {
            var result = await _statisticsService.GetUserStatisticsAsync();
            if (result.IsSuccess)
            {
                return Ok(result);
            }

            return StatusCode(500, result.ErrorMessage); // Or another suitable error status code
        }

        [HttpGet("system-statistics")]
        public async Task<ActionResult<Result<SystemStatisticsDto>>> GetSystemStatistics()
        {
            var result = await _statisticsService.GetSystemStatisticsAsync();
            if (result.IsSuccess)
            {
                return Ok(result);
            }

            return StatusCode(500, result.ErrorMessage); // Or another suitable error status code
        }
    }
}

