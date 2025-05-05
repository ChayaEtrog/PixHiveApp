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
    public class UserMessagesRepository:Repository<UserEntityMessageEntity>, IUserMessagesRepository
    {
        readonly DataContext _context;
        public UserMessagesRepository(DataContext context) : base(context)
        {
            _context = context;
        }

        public async Task<UserEntityMessageEntity> AddAsync(UserEntityMessageEntity entity)
        {
            await _context.UserMessages.AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<List<UserEntityMessageEntity>> GetMessagesByUserIdAsync(int userId)
        {
            return await _context.UserMessages
                .Where(um => um.UserId == userId)
                .ToListAsync();
        }

        public async Task<UserEntityMessageEntity> GetByUserIdAndMessageIdAsync(int userId, int messageId)
        {
            return await _context.UserMessages
                .FirstOrDefaultAsync(um => um.UserId == userId && um.MessageId == messageId);
        }
    }
}
