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
    public interface IFileService
    {
        Task<Result<IEnumerable<FileDto>>> GetFilesAsync();

        Task<Result<FileDto>> GetFileByIdAsync(int id);

        Task<Result<FileDto>> AddFileAsync(FileDto entity, int albumId);

        Task<Result<FileDto>> UpdateFileAsync(int userId, int id, string newName);

        Task<Result<FileDto>> DeleteFileAsync(int fileId );

        Task<Result<IEnumerable<FileDto>>> GetFilesByDateAsync(int userId, DateTime? startDate = null, DateTime? endDate = null, int? parentAlbumId = null);

        Task<Result<IEnumerable<FileDto>>> GetFilesByTagAndUserIdAsync(int userId, string tagName, int? parentAlbumId = null);

        Task<Result<List<FileDto>>> GetFilesByUserIdAsync(int userId);

        Task<Result<bool>> AddTagToFileAsync(int fileId, int tagId);

        Task<Result<bool>> RemoveTagFromFileAsync(int fileId, int tagId);

        Task<Result<List<TagDto>>> GetTagsByFileIdAsync(int fileId);

        Task<Result<List<FileDto>>> GetRootFilesByUserIdAsync(int userId);

        Task<Result<string>> RemoveFileFromAlbumAsync(int fileId, int albumId);

        Task<Result<List<FileDto>>> GetDeletedFilesAsync();

        Task<Result<bool>> RecycleFile(int fileId);

        Task<Result<List<FileDto>>> SearchFilesByNameAsync(int userId, string name, int parentId);
    }
}
