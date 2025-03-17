using AutoMapper;
using Microsoft.Extensions.Configuration;
using Web.Net.Core.DTOs;
using Web.Net.Core.Entity;
using Web.Net.Core.InterfaceRepository;
using Web.Net.Core.InterfaceService;
using Web.Net.Core.Shared;

namespace Web.Net.Service
{
    public class UserService(IRepositoryManager repositoryManager, IMapper mapper, IConfiguration configuration) : IUserService
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly IMapper _mapper;

        public async Task<Result<UserDto>> AddUserAsync(UserDto entity)
        {
            var users = await _repositoryManager.Users.GetAllAsync();
            if (users.Any(u => (u.Email == entity.Email||u.UserName==entity.UserName)))
                return Result<UserDto>.BadRequest("A user with this email already exists.");

            entity.CreatedAt = DateTime.Now;
            var user = _mapper.Map<UserEntity>(entity);
            await _repositoryManager.Users.AddAsync(user);
            _repositoryManager.Save();

            return Result<UserDto>.Success(_mapper.Map<UserDto>(user));
        }

        public async Task<Result<UserDto>> DeleteUserAsync(int userId)
        {
            var users = await _repositoryManager.Users.GetByIdAsync(userId);
            if (users == null)
                return Result<UserDto>.NotFound("User not found.");

            _repositoryManager.Users.DeleteStudent(userId);
            _repositoryManager.Save();

            return Result<UserDto>.Success(null); 
        }

        public async Task<Result<UserDto>> GetUserByIdAsync(int id)
        {
            var user = await _repositoryManager.Users.GetByIdAsync(id);
            if (user == null)
                return Result<UserDto>.NotFound("User not found.");

            return Result<UserDto>.Success(_mapper.Map<UserDto>(user));
        }

        public async Task<Result<IEnumerable<UserDto>>> GetUsersAsync()
        {
            var users = await _repositoryManager.Users.GetFullAsync();
            return Result<IEnumerable<UserDto>>.Success(_mapper.Map<List<UserDto>>(users));
        }

        public async Task<Result<UserDto>> UpdateUserAsync(int id, UserDto entity)
        {
            var user = await _repositoryManager.Users.GetByIdAsync(id);
            if (user == null)
                return Result<UserDto>.NotFound("User not found.");

            var result = await _repositoryManager.Users.UpdateUserAsync(_mapper.Map<UserEntity>(entity), id);
            _repositoryManager.Save();
            return Result<UserDto>.Success(_mapper.Map<UserDto>(result));
        }
    }
}
