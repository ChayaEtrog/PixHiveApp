using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using Web.Net.Core.DTOs;
using Web.Net.Core.Entity;
using Web.Net.Core.InterfaceRepository;

namespace Web.Net.Data.Repositories
{
    public class FileRepository : Repository<FileEntity>, IFileRepository
    {
        readonly DataContext _context;
        public FileRepository(DataContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<FileEntity>> GetFullAsync()
        {
            return await _context.Files
                .Include(f => f.Tags)
                .Include(f => f.Albums)
                .Include(f => f.User)
                .ToListAsync();
        }

        public  void DeleteFileAsync(int fileId)
        {
            var file = _context.Files
               .Include(f => f.Albums)
               .Include(f => f.User)
               .Include(f => f.Tags)
               .FirstOrDefault(f => f.Id == fileId);

            if (file == null) return;

            if (file.Tags != null)
            {
                file.Tags.Clear();
            }

            file.Albums.Clear();

            _context.Files.Remove(file);
        }

        public async Task<FileEntity> UpdateFileNameAsync(int fileId, string newName)
        {
            var file = await _context.Files.FindAsync(fileId);

            if (file == null)
            {
                return null;
            }

            file.DisplayName = newName;
            file.UpdateAt = DateTime.Now;

            return file;
        }

        public async Task<List<int>> GetAlbumHierarchyAsync(int parentId)
        {
            var result = new List<int> { parentId };

            var children = await _context.Albums
                .Where(a => a.ParentId == parentId)
                .Select(a => a.Id)
                .ToListAsync();

            foreach (var childId in children)
            {
                result.AddRange(await GetAlbumHierarchyAsync(childId));
            }

            return result;
        }

        public async Task<List<FileEntity>> GetFilesByTagAndUserIdAsync(int userId, string tagName, int? parentAlbumId = null)
        {
            var query = _context.Files
                .Include(f => f.Tags)
                .Include(f => f.Albums)
                .Where(f => f.UserId == userId && f.IsDeleted == false)
                .Where(f => f.Tags.Any(t => t.TagName == tagName));

            if (parentAlbumId.HasValue)
            {
                var albumIds = await GetAlbumHierarchyAsync(parentAlbumId.Value);
                query = query.Where(f => f.Albums.Any(a => albumIds.Contains(a.Id)));
            }

            return await query.ToListAsync();
        }

        public async Task<List<FileEntity>> GetFilesByDateAsync(int userId, DateTime? startDate, DateTime? endDate, int? parentAlbumId = null)
        {
            var query = _context.Files
                .Include(f => f.Albums)
                .Where(f => f.UserId == userId && f.IsDeleted == false);

            if (startDate.HasValue)
                query = query.Where(f => f.UploadedAt >= startDate.Value);
            if (endDate.HasValue)
                query = query.Where(f => f.UploadedAt <= endDate.Value);

            if (parentAlbumId.HasValue)
            {
                var albumIds = await GetAlbumHierarchyAsync(parentAlbumId.Value);
                query = query.Where(f => f.Albums.Any(a => albumIds.Contains(a.Id)));
            }

            return await query.ToListAsync();
        }

        public async Task<List<FileEntity>> GetFilesByUserIdAsync(int userId)
        {
            var files = await _context.Files
                .Where(f => f.UserId == userId)
                .Where(f => f.IsDeleted == false)
                .ToListAsync();

            return files;
        }

        public async Task<bool> AddTagToFileAsync(int fileId, int tagId)
        {
            var file = await _context.Files
                .Include(f => f.Tags)
                .FirstOrDefaultAsync(f => f.Id == fileId);

            if (file == null) return false;

            var tag = await _context.Tags.FindAsync(tagId);
            if (tag == null) return false;

            if (!file.Tags.Contains(tag))
            {
                file.Tags.Add(tag);
            }

            return true;
        }

        public async Task<bool> RemoveTagFromFileAsync(int fileId, int tagId)
        {
            var file = await _context.Files
                .Include(f => f.Tags)
                .FirstOrDefaultAsync(f => f.Id == fileId);

            if (file == null) return false;

            var tag = file.Tags.FirstOrDefault(t => t.Id == tagId);
            if (tag == null) return false;

            file.Tags.Remove(tag);

            if (!file.Tags.Any())
            {
                var defaultTag = await _context.Tags.FirstOrDefaultAsync(t => t.TagName == "DefultTag");
                if (defaultTag != null)
                {
                    file.Tags.Add(defaultTag);
                }
            }

            return true;
        }

        public async Task<List<TagEntity>> GetTagsByFileIdAsync(int fileId)
        {
            var file = await _context.Files
                .Include(f => f.Tags) 
                .FirstOrDefaultAsync(f => f.Id == fileId);

            return file?.Tags;
        }

        public async Task<List<FileEntity>> GetRootFilesByUserId(int userId)
        {
            var files = await _context.Files
                    .Where(f => f.UserId == userId)
                    .Where(f => !f.Albums.Any())
                    .Where(f=>f.IsDeleted==false)
                    .ToListAsync();

            return files;
        }

        public async Task<List<FileEntity>> GetDeletedFilesAsync()
        {
            return await _context.Files
                .Where(f => f.IsDeleted)
                .ToListAsync();
        }

        public async Task<List<FileEntity>> SearchFilesByNameAsync(int userId, string name, int parentId)
        {
            List<FileEntity> files;

            if (parentId == -1)
            {
                files = await _context.Files
                    .Where(f => f.UserId == userId && f.DisplayName.Contains(name))
                    .ToListAsync();
            }
            else
            {
                var albumIds = await GetAlbumHierarchyAsync(parentId);

                files = await _context.Files
                    .Where(f => f.DisplayName.Contains(name) &&
                                f.Albums.Any(a => albumIds.Contains(a.Id)))
                    .ToListAsync();
            }

            return files;
        }
    }
}
