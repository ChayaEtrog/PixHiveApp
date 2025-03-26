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
        Task<IEnumerable<MessageEntity>> GetFullAsync();

        void DeleteMessage(int messageId);

        Task<MessageEntity> ToggleMessageStatusAsync(int messageId);
    }
}
