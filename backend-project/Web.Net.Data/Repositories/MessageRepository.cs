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

        //public async Task<IEnumerable<MessageEntity>> GetFullAsync()
        //{
        //    return await _context.Messages
        //        .Include(f => f.User).ToListAsync();
        //}

        //public void DeleteMessage(int messageId)
        //{
        //    var message =  _context.Messages
        //        .FirstOrDefault(m => m.Id == messageId);

        //    if (message != null)
        //    {
        //        var user =  _context.Users
        //            .Include(u => u.Messages)
        //            .FirstOrDefault(u => u.Id == message.UserId); 

        //        if (user != null)
        //        {
        //            user.Messages.Remove(message);
        //        }
        //        _context.Messages.Remove(message);
        //         _context.SaveChanges();
        //    }
        //}

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

        public async Task<List<MessageEntity>> GetAllMessagesAsync()
        {
            return await _context.Messages
                .Include(m => m.Sender)
                .Include(m => m.Receiver)
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<MessageEntity>> GetMessagesForUserAsync(int userId)
        {
            return await _context.Messages
                .Where(m => m.ReceiverId == null || m.ReceiverId == userId)
                .Where(m => m.IsActive)
                .Include(m => m.UserMessages)
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();
        }

        public async Task DeleteMessageAsync(MessageEntity message)
        {
            _context.Messages.Remove(message);
        }

        public async Task MarkAsReadAsync(int userId, int messageId)
        {
            var record = await _context.UserMessages
                .FirstOrDefaultAsync(um => um.UserId == userId && um.MessageId == messageId);

            if (record == null)
            {
                _context.UserMessages.Add(new UserEntityMessageEntity
                {
                    UserId = userId,
                    MessageId = messageId,
                    IsRead = true,
                    ReadAt = DateTime.UtcNow
                });
            }
            else
            {
                record.IsRead = true;
                record.ReadAt = DateTime.UtcNow;
            }
        }
    }
}
