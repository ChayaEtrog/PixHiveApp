using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Web.Net.Core.Entity;

namespace Web.Net.Core.InterfaceRepository
{
    public interface IUserImageEditCountRepository : IRepository<UserImageEditEntity>
    {
        Task<UserImageEditEntity> GetByUserIdAsync(int userId);

        Task AddAsync(UserImageEditEntity entity);

        Task UpdateAsync(UserImageEditEntity entity);
    }
}
