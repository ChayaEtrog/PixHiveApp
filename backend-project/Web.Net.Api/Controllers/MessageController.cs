using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Web.Net.Api.PostModels;
using Web.Net.Core.DTOs;
using Web.Net.Core.InterfaceService;
using Web.Net.Service;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Web.Net.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController(IMessageService messageService, IMapper mapper) : ControllerBase
    {
        private readonly IMessageService _messageService = messageService;
        private readonly IMapper _mapper = mapper;

        [HttpPost]
        [Authorize]
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

        [HttpGet]
        public async Task<IActionResult> GetAllMessages()
        {
            var result = await _messageService.GetAllMessagesAsync();
            return result.IsSuccess ? Ok(result.Data) : BadRequest(result.ErrorMessage);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetMessagesForUser(int userId)
        {
            var result = await _messageService.GetMessagesForUserAsync(userId);
            return result.IsSuccess ? Ok(result.Data) : BadRequest(result.ErrorMessage);
        }

        [HttpPost("mark-as-read")]
        public async Task<IActionResult> MarkAsRead([FromQuery] int userId, [FromQuery] int messageId)
        {
            var result = await _messageService.MarkAsReadAsync(userId, messageId);
            return result.IsSuccess ? Ok(result.Data) : BadRequest(result.ErrorMessage);
        }

        [HttpDelete("{messageId}")]
        public async Task<IActionResult> DeleteMessage(int messageId)
        {
            var result = await _messageService.DeleteMessageAsync(messageId);
            if (result.IsSuccess)
            {
                return Ok(new { message = "Success" });  // החזרת אובייקט JSON עם המפתח 'message'
            }
            else
            {
                return BadRequest(new { error = result.ErrorMessage });  // החזרת אובייקט JSON עם המפתח 'error'
            }
        }
    }
}
