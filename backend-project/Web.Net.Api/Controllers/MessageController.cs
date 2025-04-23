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
    public class MessageController(IMessageService messageService, IMapper mapper) : ControllerBase
    {
        private readonly IMessageService _messageService = messageService;
        private readonly IMapper _mapper = mapper;

        // GET: api/<MessageController>
        [HttpGet]
        [Authorize]
        public async Task<ActionResult> Get()
        {
            var result = await _messageService.GetMessagesAsync();
            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, result.ErrorMessage);

            return Ok(result.Data);
        }

        // GET api/<MessageController>/5
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult> Get(int id)
        {
            var result = await _messageService.GetMessageByIdAsync(id);
            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, result.ErrorMessage);

            return result.Data == null ? NotFound() : Ok(result.Data);
        }

        // POST api/<MessageController>
        [HttpPost]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult> Post([FromBody] MessagePostModel message)
        {
            var entityDto = _mapper.Map<MessageDto>(message);
            var result = await _messageService.AddMessageAsync(entityDto);
            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, result.ErrorMessage);

            return Ok(result.Data);
        }

        // PUT api/<MessageController>/5
        [HttpPut("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult> Put(int id)
        {
            var result = await _messageService.UpdateMessageAsync(id);
            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, result.ErrorMessage);

            return result.Data == null ? NotFound() : Ok(result.Data);
        }

        // DELETE api/<MessageController>/5
        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult> Delete(int id)
        {
            var result = await _messageService.GetMessageByIdAsync(id);
            if (!result.IsSuccess || result.Data == null)
            {
                return NotFound();
            }

            await _messageService.DeleteMessageAsync(id);
            return NoContent();
        }

        [HttpGet("user/{userId}/messages")]
        [Authorize]
        public async Task<IActionResult> GetMessagesForUser(int userId)
        {
            var result = await _messageService.GetMessagesForUserAsync(userId);
            if (!result.IsSuccess)
                return NotFound(result.ErrorMessage);

            return Ok(result.Data);
        }

        [HttpPost("user/{userId}/message/{messageId}/read")]
        [Authorize]
        public async Task<IActionResult> MarkMessageAsRead(int userId, int messageId)
        {
            var result = await _messageService.MarkMessageAsReadAsync(userId, messageId);
            if (!result.IsSuccess)
                return BadRequest(result.ErrorMessage);

            return Ok();
        }

        [HttpGet("user/{userId}")]
        [Authorize]
        public async Task<IActionResult> GetMessages(int userId)
        {
            var result = await _messageService.GetMessagesAsync(userId);

            return Ok(result);
        }
    }
}
