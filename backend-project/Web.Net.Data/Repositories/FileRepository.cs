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

            _context.SaveChanges();

            _context.Files.Remove(file);
            _context.SaveChanges();
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

            await _context.SaveChangesAsync();

            return file;
        }


        public async Task<IEnumerable<FileEntity>> GetFilesByTagAndUserIdAsync(int userId, string tagName)
        {
            var files = await _context.Files
                .Where(f => f.UserId == userId) // מסנן את הקבצים לפי userId
                .Where(f => f.Tags.Any(t => t.TagName == tagName))
                .Where(f => f.IsDeleted == false)
                .Include(f => f.Tags) // טוען את התיוגים של כל קובץ
                .ToListAsync(); // מחזיר את התוצאות

            return files;
        }

        public async Task<IEnumerable<FileEntity>> GetFilesByDateAsync(DateTime? startDate = null, DateTime? endDate = null)
        {
            IQueryable<FileEntity> query = _context.Files;

            if (startDate.HasValue)
            {
                var start = startDate.Value.Date;
                query = query.Where(f => f.UploadedAt.Date >= start.Date).Where(f => f.IsDeleted == false);
            }

            if (endDate.HasValue)
            {
                var end = endDate.Value.Date;
                query = query.Where(f => f.UploadedAt.Date <= end.Date).Where(f => f.IsDeleted == false);
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
                await _context.SaveChangesAsync();
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
            await _context.SaveChangesAsync();

            if (!file.Tags.Any())
            {
                var defaultTag = await _context.Tags.FirstOrDefaultAsync(t => t.TagName == "DefultTag");

                file.Tags.Add(defaultTag);
                await _context.SaveChangesAsync();
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
    }
}
