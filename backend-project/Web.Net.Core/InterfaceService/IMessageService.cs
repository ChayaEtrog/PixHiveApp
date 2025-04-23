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
        Task<Result<IEnumerable<MessageDto>>> GetMessagesAsync();

        Task<Result<MessageDto>> GetMessageByIdAsync(int id);

        Task<Result<MessageDto>> AddMessageAsync(MessageDto entity);

        Task<Result<MessageDto>> UpdateMessageAsync(int id);

        Task<Result<MessageDto>> DeleteMessageAsync(int messageId);

        Task<Result<List<MessageDto>>> GetMessagesForUserAsync(int userId);

        Task<List<MessageDto>> GetMessagesAsync(int userId);

        Task<Result<String>> MarkMessageAsReadAsync(int userId, int messageId);


    }
}
