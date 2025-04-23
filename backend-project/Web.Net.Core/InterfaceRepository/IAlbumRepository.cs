using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Web.Net.Core.Entity;

namespace Web.Net.Core.InterfaceRepository
{
    public interface IAlbumRepository:IRepository<AlbumEntity>
    {
        Task<List<AlbumEntity>> GetFullAsync();

        void DeleteAlbumAsync(int albumId);

        Task<AlbumEntity> UpdateAlbumNameAsync(int albumId, string newName);

        Task<FileEntity> AddFileToAlbumAsync(int albumId, int fileId);

        Task<List<FileEntity>> GetFilesByAlbumIdAsync(int albumId);

        Task<List<AlbumEntity>> GetAlbumsByUserIdAsync(int userId);

        Task<List<AlbumEntity>> GetChildAlbumsByUserId(int userId,int? parentId = null);

        Task<List<AlbumEntity>> SearchAlbumsByNameAsync(int userId, string name, int parentId);
        
        Task<List<AlbumEntity>> GetAlbumsByDateAsync(int userId, DateTime? startDate, DateTime? endDate, int? parentAlbumId = null);
    }
}
