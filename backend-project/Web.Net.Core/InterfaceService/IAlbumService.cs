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
    public interface IAlbumService
    {
        Task<Result<IEnumerable<AlbumDto>>> GetAlbumsAsync();

        Task<Result<AlbumDto>> GetAlbumByIdAsync(int id);

        Task<Result<AlbumDto>> AddAlbumAsync(AlbumDto entity);

        Task<Result<AlbumDto>> UpdateAlbumAsync(int userId, int id, string newName);

        Task<Result<AlbumDto>> DeleteAlbumAsync(int albumId);

        Task<Result<bool>> AddFileToAlbumAsync(int albumId, int fileId);

        Task<Result<List<FileDto>>> GetFilesByAlbumIdAsync(int albumId);

        Task<Result<List<AlbumDto>>> GetAlbumsByUserIdAsync(int userId);

        Task<Result<List<AlbumDto>>> GetChildAlbumsAsync(int userId, int? parentId = null);
    }
}
