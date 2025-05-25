using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Web.Net.Core.Entity;

namespace Web.Net.Core.InterfaceRepository
{
    public interface IUserRepository:IRepository<UserEntity>
    {
        Task<IEnumerable<UserEntity>> GetFullAsync();

        Task<UserEntity> GetFullUserByEmail(string UserEmail);

        void DeleteUser(int userId);

        Task<UserEntity> UpdateUserAsync(UserEntity user, int index);

        UserEntity GetUserWithRoles(string usernameOrEmail);

        Task<UserEntity> GetUserByIdAsync(int userId);

        IEnumerable<Role> GetUserRoles(int userId);
    }
}
