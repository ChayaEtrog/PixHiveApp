using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Web.Net.Core.Entity;

namespace Web.Net.Core.InterfaceRepository
{
    public interface IMessageRepository:IRepository<MessageEntity>
    {
        Task<MessageEntity> ToggleMessageStatusAsync(int messageId);

        Task<List<MessageEntity>> GetAllMessagesAsync();

        Task<List<MessageEntity>> GetMessagesForUserAsync(int userId);

        Task DeleteMessageAsync(MessageEntity message);

        Task MarkAsReadAsync(int userId, int messageId);
    }
}
