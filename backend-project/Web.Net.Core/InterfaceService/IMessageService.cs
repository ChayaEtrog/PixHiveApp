using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Web.Net.Core.DTOs;
using Web.Net.Core.Entity;
using Web.Net.Core.Shared;

namespace Web.Net.Core.InterfaceService
{
    public interface IMessageService
    {
        Task<Result<MessageDto>> AddMessageAsync(MessageDto entity);

        Task<Result<MessageDto>> UpdateMessageAsync(int id);

        Task<Result<List<MessageDto>>> GetMessagesForUserAsync(int userId);

        Task<Result<List<MessageDto>>> GetAllMessagesAsync();

        Task<Result<string>> MarkAsReadAsync(int userId, int messageId);

        Task<Result<string>> DeleteMessageAsync(int messageId);
    }
}
