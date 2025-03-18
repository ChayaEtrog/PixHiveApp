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
    public interface IUserService
    {
        Task<Result<List<UserDto>>> GetUsersAsync();

        Task<Result<UserDto>> GetUserByIdAsync(int id);

        Task<Result<UserDto>> AddUserAsync(UserDto entity);

        Task<Result<UserDto>> UpdateUserAsync(int id, UserDto entity);

        Task<Result<UserDto>> DeleteUserAsync(int userId);

        Task<Result<List<UserGrowthDto>>> GetUserGrowthByMonth();

    }
}
