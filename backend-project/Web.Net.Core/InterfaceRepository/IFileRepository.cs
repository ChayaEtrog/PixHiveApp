using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Web.Net.Core.Entity;

namespace Web.Net.Core.InterfaceRepository
{
    public interface IFileRepository : IRepository<FileEntity>
    {
        Task<IEnumerable<FileEntity>> GetFullAsync();

        void DeleteFileAsync(int fileId);

        Task<FileEntity> UpdateFileNameAsync(int fileId, string newName);

        Task<IEnumerable<FileEntity>> GetFilesByTagAndUserIdAsync(int userId, string tagName);

        Task<IEnumerable<FileEntity>> GetFilesByDateAsync(DateTime? startDate = null, DateTime? endDate = null);

        Task<List<FileEntity>> GetFilesByUserIdAsync(int userId);

        Task<bool> AddTagToFileAsync(int fileId, int tagId);

        Task<bool> RemoveTagFromFileAsync(int fileId, int tagId);

        Task<List<TagEntity>> GetTagsByFileIdAsync(int fileId);

        Task<List<FileEntity>> GetRootFilesByUserId(int userId);

        Task<List<FileEntity>> GetDeletedFilesAsync();

        Task<List<FileEntity>> SearchFilesByNameAsync(string name, int parentId);
    }
}
