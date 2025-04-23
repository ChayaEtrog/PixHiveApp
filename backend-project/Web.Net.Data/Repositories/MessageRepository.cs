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

        public async Task<List<MessageEntity>> GetMessagesWithReadStatusAsync()
        {
            return await _context.Messages
                .Include(m => m.ReadByUsers) // טוען גם את המשתמשים שקראו
                .ToListAsync();
        }

        public async Task MarkMessageAsReadAsync(int userId, int messageId)
        {
            var message = await _context.Messages
                .Include(m => m.ReadByUsers)
                .FirstOrDefaultAsync(m => m.Id == messageId);

            if (message == null)
                throw new Exception("Message not found.");

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                throw new Exception("User not found.");

            if (!message.ReadByUsers.Contains(user))
            {
                message.ReadByUsers.Add(user);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> IsMessageReadAsync(int userId, int messageId)
        {
            return await _context.UserMessageReads
                .AnyAsync(umr => umr.UserId == userId && umr.MessageId == messageId);
        }

        //public async Task<List<MessageEntity>> GetMessagesAsync()
        //{
        //    return await _context.Messages
        //        .OrderByDescending(m => m.CreatedAt)
        //        .ToListAsync();
        //}

        //public async Task MarkMessageAsReadAsync(int userId, int messageId)
        //{
        //    if (!await IsMessageReadAsync(userId, messageId))
        //    {
        //        _context.UserMessageReads.Add(new UserMessageReads
        //        {
        //            UserId = userId,
        //            MessageId = messageId,
        //        });
        //        await _context.SaveChangesAsync();
        //    }
        //}

        //public async Task MarkMessageAsReadAsync(int userId, int messageId)
        //{
        //    var exists = await _context.UserMessageReads
        //        .AnyAsync(umr => umr.UserId == userId && umr.MessageId == messageId);

        //    if (!exists)
        //    {
        //        var readEntry = new UserMessageReads
        //        {
        //            UserId = userId,
        //            MessageId = messageId
        //        };

        //        _context.UserMessageReads.Add(readEntry);
        //        await _context.SaveChangesAsync();
        //    }
        //}

        public async Task<List<MessageEntity>> GetMessagesAsync()
        {
            return await _context.Messages
                .Include(m => m.User) // טוען את היוצר של ההודעה
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();
        }

        public async Task<HashSet<int>> GetReadMessagesAsync(int userId)
        {
            return await _context.UserMessageReads
                .Where(umr => umr.UserId == userId)
                .Select(umr => umr.MessageId)
                .ToHashSetAsync(); // HashSet לבדיקה מהירה יותר
        }
    }
}
