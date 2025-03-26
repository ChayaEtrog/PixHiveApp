using AutoMapper;
using Microsoft.Extensions.Configuration;
using Web.Net.Core.DTOs;
using Web.Net.Core.Entity;
using Web.Net.Core.InterfaceRepository;
using Web.Net.Core.InterfaceService;
using Web.Net.Core.Shared;

namespace Web.Net.Service
{
    public class UserService(IRepositoryManager repositoryManager, IMapper mapper) : IUserService
    {
        private readonly IRepositoryManager _repositoryManager = repositoryManager;
        private readonly IMapper _mapper = mapper;

        public async Task<Result<UserDto>> AddUserAsync(UserDto entity)
        {
            var users = await _repositoryManager.Users.GetAllAsync();
            if (users.Any(u => (u.Email == entity.Email || u.UserName == entity.UserName)))
                return Result<UserDto>.BadRequest("A user with this email already exists.");

            entity.CreatedAt = DateTime.Now;
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(entity.PasswordHash);
            entity.PasswordHash = hashedPassword;

            var user = _mapper.Map<UserEntity>(entity);
            await _repositoryManager.Users.AddAsync(user);
            await _repositoryManager.Save();

            return Result<UserDto>.Success(_mapper.Map<UserDto>(user));
        }

        public async Task<Result<UserDto>> DeleteUserAsync(int userId)
        {
            var users = await _repositoryManager.Users.GetByIdAsync(userId);
            if (users == null)
                return Result<UserDto>.NotFound("User not found.");

            _repositoryManager.Users.DeleteStudent(userId);
            await _repositoryManager.Save();

            return Result<UserDto>.Success(null);
        }

        public async Task<Result<UserDto>> GetUserByIdAsync(int id)
        {
            var user = await _repositoryManager.Users.GetByIdAsync(id);
            if (user == null)
                return Result<UserDto>.NotFound("User not found.");

            return Result<UserDto>.Success(_mapper.Map<UserDto>(user));
        }

        public async Task<Result<List<UserDto>>> GetUsersAsync()
        {
            var users = await _repositoryManager.Users.GetFullAsync();
            return Result<List<UserDto>>.Success(_mapper.Map<List<UserDto>>(users));
        }

        public async Task<Result<UserDto>> UpdateUserAsync(int id, UserDto entity)
        {
            var user = await _repositoryManager.Users.GetByIdAsync(id);
            if (user == null)
                return Result<UserDto>.NotFound("User not found.");

            var result = await _repositoryManager.Users.UpdateUserAsync(_mapper.Map<UserEntity>(entity), id);
            await _repositoryManager.Save();
            return Result<UserDto>.Success(_mapper.Map<UserDto>(result));
        }

        public async Task<Result<List<UserGrowthDto>>> GetUserGrowthByMonth()
        {
            var usersResult = await GetUsersAsync();

            // בדיקה אם הקריאה ל-GetUsersAsync הצליחה
            if (!usersResult.IsSuccess || usersResult.Data == null || !usersResult.Data.Any())
            {
                // אם לא הצלחנו לקבל את הנתונים או שהרשימה ריקה, מחזירים שגיאה
                return Result<List<UserGrowthDto>>.Failure("No users found or failed to fetch users.");
            }

            // ביצוע פעולת grouping על המשתמשים והפיכת התוצאה לרשימה של UserGrowthDTO
            var result = usersResult.Data
                .GroupBy(u => new { Year = u.CreatedAt.Year, Month = u.CreatedAt.Month })
                .Select(g => new UserGrowthDto
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    UserCount = g.Count()
                })
                .OrderBy(x => x.Year)
                .ThenBy(x => x.Month)
                .ToList();

            // אם הצלחנו, מחזירים את התוצאה עם Success
            return Result<List<UserGrowthDto>>.Success(result);
        }
    }
}
