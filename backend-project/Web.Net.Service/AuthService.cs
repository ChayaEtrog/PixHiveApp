using AutoMapper;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Web.Net.Core.DTOs;
using Web.Net.Core.Entity;
using Web.Net.Core.InterfaceRepository;
using Web.Net.Core.InterfaceService;
using Web.Net.Core.Shared;
using Web.Net.Data.Repositories;

namespace Web.Net.Service
{
    public class AuthService(IConfiguration configuration, IRepositoryManager repositoryManager, IMapper mapper) : IAuthService
    {
        private readonly IConfiguration _configuration = configuration;
        private readonly IRepositoryManager _repositoryManager = repositoryManager;
        private readonly IMapper _mapper = mapper;

        public string GenerateJwtToken(UserEntity user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            // Add roles as claims
            if (user.UserRoles != null)
            {
                foreach (var role in user.UserRoles.Select(r => r.RoleName))
                {
                    claims.Add(new Claim(ClaimTypes.Role, role));
                }
            }

            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: DateTime.UtcNow.AddHours(100),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public bool ValidateUser(string usernameOrEmail, string password, out string[] roles, out UserEntity user)
        {
            roles = null;
            user = _repositoryManager.Users.GetUserWithRoles(usernameOrEmail);

            if (user != null && BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            {
                roles = user.UserRoles.Select(r => r.RoleName).ToArray();
                return true;
            }

            return false;
        }

        public Result<LoginResponseDto> Login(string usernameOrEmail, string password)
        {
            if (ValidateUser(usernameOrEmail, password, out var roles, out var user))
            {
                var token = GenerateJwtToken(user);
                var userDto = _mapper.Map<UserDto>(user);
                var response = new LoginResponseDto
                {
                    User = userDto,
                    Token = token
                };
                return Result<LoginResponseDto>.Success(response);
            }

            return Result<LoginResponseDto>.Failure("Invalid username or password.");
        }

        public async Task<Result<LoginResponseDto>> Register(UserDto userDto)
        {
            var userList = await _repositoryManager.Users.GetAllAsync();
            bool condition = userList.Any(u => u.UserName == userDto.UserName || u.Email == userDto.Email);

            if (condition)
            {
                return Result<LoginResponseDto>.Failure("Username or email already exists.");
            }

            // הצפנת הסיסמה באמצעות BCrypt לפני השמירה במסד הנתונים
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(userDto.PasswordHash);

            var user = new UserEntity
            {
                UserName = userDto.UserName,
                Email = userDto.Email,
                PasswordHash = hashedPassword,  // שמירת הסיסמה המוצפנת
                PhoneNumber = userDto.PhoneNumber,
                CreatedAt = DateTime.Now,
            };

            user.UserRoles = new List<Role>();
            var userRole = _repositoryManager.Roles.GetByName("User");
            if (userRole != null)
            {
                user.UserRoles.Add(userRole);
            }

            var result = await _repositoryManager.Users.AddAsync(user);
            if (result == null)
            {
                return Result<LoginResponseDto>.Failure("Failed to register user.");
            }

            var token = GenerateJwtToken(result);
            await _repositoryManager.Save();

            var responseUserDto = _mapper.Map<UserDto>(result);
            var response = new LoginResponseDto
            {
                User = responseUserDto,
                Token = token
            };
            return Result<LoginResponseDto>.Success(response);
        }

        public async Task<Result<LoginResponseDto>> UpgradeToAdmin(int userId, string password)
        {
            var adminPassword = _configuration["Jwt:AdminPassword"];
            if (password != adminPassword)
            {
                return Result<LoginResponseDto>.Failure("Incorrect admin password.");
            }

            var user = await _repositoryManager.Users.GetUserByIdAsync(userId);
            if (user == null)
            {
                return Result<LoginResponseDto>.Failure("User not found.");
            }

            var adminRole = _repositoryManager.Roles.GetByName("Admin");
            if (adminRole == null)
            {
                return Result<LoginResponseDto>.Failure("Admin role not found.");
            }

            if (!user.UserRoles.Any(r => r.RoleName == "Admin"))
            {
                user.UserRoles.Add(adminRole);
                await _repositoryManager.Save();
            }

            var token = GenerateJwtToken(user);
            var userDto = _mapper.Map<UserDto>(user);
            var response = new LoginResponseDto
            {
                User = userDto,
                Token = token
            };

            return Result<LoginResponseDto>.Success(response);
        }
    }
}
