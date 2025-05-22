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
    public class UserImageEditCountRepository : Repository<UserImageEditEntity> , IUserImageEditCountRepository
    {
        private readonly DataContext _context;

        public UserImageEditCountRepository(DataContext context) : base(context)
        {
            _context = context;
        }

        public async Task<UserImageEditEntity> GetByUserIdAsync(int userId)
        {
            return await _context.UserImageEditCounts
                .FirstOrDefaultAsync(x => x.UserId == userId);
        }

        public async Task AddAsync(UserImageEditEntity entity)
        {
            await _context.UserImageEditCounts.AddAsync(entity);
        }

        public async Task UpdateAsync(UserImageEditEntity entity)
        {
            _context.UserImageEditCounts.Update(entity);
        }
    }
}
