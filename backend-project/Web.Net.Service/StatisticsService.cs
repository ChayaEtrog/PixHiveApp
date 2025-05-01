using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Web.Net.Core.DTOs;
using Web.Net.Core.InterfaceRepository;
using Web.Net.Core.InterfaceService;
using Web.Net.Core.Shared;
using Web.Net.Data;

namespace Web.Net.Service
{
    public class StatisticsService : IStatisticsService
    {
        private readonly IRepositoryManager _repositoryManager;

        public StatisticsService(IRepositoryManager repositoryManager)
        {
            _repositoryManager = repositoryManager;
        }

        // סטטיסטיקה לכל משתמש
        public async Task<Result<IEnumerable<UserStatisticsDto>>> GetUserStatisticsAsync()
        {
            var users = await _repositoryManager.Users.GetAllAsync();
            var albums = await _repositoryManager.Albums.GetAllAsync();
            var files = await _repositoryManager.Files.GetAllAsync();

            var userStats = users.Select(user => new UserStatisticsDto
            {
                UserId = user.Id,
                Username = user.UserName,
                AlbumCount = albums.Count(a => a.UserId == user.Id),
                FileCount = files.Count(f => f.UserId == user.Id),
                UsedMegabytes = Math.Round(files.Where(f => f.UserId == user.Id).Sum(f => f.FileSize) / 1024.0 / 1024.0, 2)
            }).ToList();

            return Result<IEnumerable<UserStatisticsDto>>.Success(userStats);
        }

        // סטטיסטיקה כללית של המערכת
        public async Task<Result<SystemStatisticsDto>> GetSystemStatisticsAsync()
        {
            var users = await _repositoryManager.Users.GetAllAsync();
            var totalUsers = users.Count();
            var albums = await _repositoryManager.Albums.GetAllAsync();
            var totalAlbums = albums.Count();
            var files = await _repositoryManager.Files.GetAllAsync();
            var totalFiles = files.Count();

            var systemStats = new SystemStatisticsDto
            {
                TotalUsers = totalUsers,
                TotalAlbums = totalAlbums,
                TotalFiles = totalFiles
            };

            return Result<SystemStatisticsDto>.Success(systemStats);
        }

        public async Task<Result<UserStatisticsDto>> GetUserStatisticsByIdAsync(int id)
        {
            var user = await _repositoryManager.Users.GetByIdAsync(id);
            if (user == null)
                return Result<UserStatisticsDto>.Failure("User not found", 404);

            var albums = await _repositoryManager.Albums.GetAllAsync();
            var files = await _repositoryManager.Files.GetAllAsync();

            var stats = new UserStatisticsDto
            {
                UserId = user.Id,
                Username = user.UserName,
                AlbumCount = albums.Count(a => a.UserId == user.Id),
                FileCount = files.Count(f => f.UserId == user.Id),
                UsedMegabytes = Math.Round(
                    files.Where(f => f.UserId == user.Id).Sum(f => f.FileSize) / 1024.0 / 1024.0, 2)
            };

            return Result<UserStatisticsDto>.Success(stats);
        }
    }

}

