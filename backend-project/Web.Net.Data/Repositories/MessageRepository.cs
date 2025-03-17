using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Web.Net.Core.Entity;
using Web.Net.Core.InterfaceRepository;

namespace Web.Net.Data.Repositories
{
    public class MessageRepository:Repository<MessageEntity>,IMessageRepository
    {
        readonly DataContext _context;
        public MessageRepository(DataContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<MessageEntity>> GetFullAsync()
        {
            return await _context.Messages
                .Include(f => f.User).ToListAsync();
        }

        public void DeleteMessage(int messageId)
        {
            var message =  _context.Messages
                .FirstOrDefault(m => m.Id == messageId);

            if (message != null)
            {
                var user =  _context.Users
                    .Include(u => u.Messages)
                    .FirstOrDefault(u => u.Id == message.UserId); 

                if (user != null)
                {
                    user.Messages.Remove(message);
                }
                _context.Messages.Remove(message);
                 _context.SaveChanges();
            }
        }

        public async Task<MessageEntity> ToggleMessageStatusAsync(int messageId)
        {
            var message = await _context.Messages.FindAsync(messageId);
            if (message == null)
            {
                return null;  
            }

            message.IsActive = !message.IsActive;

            await _context.SaveChangesAsync();
            return message; 
        }
    }
}
