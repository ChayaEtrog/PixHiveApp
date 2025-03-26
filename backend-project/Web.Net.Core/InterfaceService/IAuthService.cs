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
    public interface IAuthService
    {
        string GenerateJwtToken(UserEntity user);

        bool ValidateUser(string usernameOrEmail, string password, out string[] roles, out UserEntity user);
       
        Result<LoginResponseDto> Login(string usernameOrEmail, string password);

        Task<Result<LoginResponseDto>> Register(UserDto userDto);

        Task<Result<LoginResponseDto>> UpgradeToAdmin(int userId, string password);
    }
}
