using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Web.Net.Core.DTOs;
using Web.Net.Core.Entity;
using Web.Net.Core.InterfaceRepository;

namespace Web.Net.Data.Repositories
{
    public class AlbumRepository : Repository<AlbumEntity>, IAlbumRepository
    {
        readonly DataContext _context;
        public AlbumRepository(DataContext context) : base(context)
        {
            _context = context;
        }
        public async Task<List<AlbumEntity>> GetFullAsync()
        {
            return await _context.Albums
        .Include(a => a.User)
        .Include(a => a.Files).ToListAsync();

        }

        public async Task DeleteAlbumAsync(int albumId)
        {
            var album = await _context.Albums
                .Include(a => a.Files)
                .Include(a => a.User)
                .FirstOrDefaultAsync(a => a.Id == albumId);

            if (album == null) return;

            var childAlbums = await _context.Albums
                .Where(a => a.ParentId == albumId)
                .ToListAsync();

            foreach (var child in childAlbums)
            {
                await DeleteAlbumAsync(child.Id);
            }

            album.Files.Clear();
            _context.Albums.Remove(album);
        }

        public async Task<AlbumEntity> UpdateAlbumNameAsync(int albumId, string newName)
        {
            var album = await _context.Albums.FindAsync(albumId);

            if (album == null)
            {
                return null;
            }

            album.AlbumName = newName;

            return album;
        }

        public async Task<FileEntity> AddFileToAlbumAsync(int albumId, int fileId)
        {
            var album = await _context.Albums
                .Include(a => a.Files)
                .FirstOrDefaultAsync(a => a.Id == albumId);

            if (album == null) return null;

            var file = await _context.Files.FindAsync(fileId);
            if (file == null) return null;

            if (!album.Files.Contains(file))
            {
                file.Albums.Add(album);
                album.Files.Add(file);
            }

            return file;
        }


        public async Task<List<FileEntity>> GetFilesByAlbumIdAsync(int albumId)
        {

            var album = await _context.Albums
                .Include(a => a.Files)
                .FirstOrDefaultAsync(a => a.Id == albumId);

            if (album == null) return null;

            return album.Files;
        }

        public async Task<List<AlbumEntity>> GetAlbumsByUserIdAsync(int userId)
        {
            var albums = await _context.Albums
                .Where(a => a.UserId == userId)
                .ToListAsync();

            return albums;
        }

        public async Task<List<AlbumEntity>> GetChildAlbumsByUserId(int userId, int? parentId = null)
        {
            return await _context.Albums
                .Where(a => a.ParentId == parentId && a.UserId == userId)
                .ToListAsync();
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

        public async Task<List<AlbumEntity>> GetAlbumsByDateAsync(int userId, DateTime? startDate, DateTime? endDate, int? parentAlbumId = null)
        {
            var query = _context.Albums
                .Include(a => a.Files)
                .Where(a => a.UserId == userId);

            if (startDate.HasValue)
                query = query.Where(a => a.CreatedAt >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(a => a.CreatedAt <= endDate.Value);

            if (parentAlbumId.HasValue)
            {
                var albumIds = await GetAlbumHierarchyAsync(parentAlbumId.Value);
                query = query.Where(a => albumIds.Contains(a.Id));
            }

            return await query.ToListAsync();
        }

        public async Task<List<AlbumEntity>> SearchAlbumsByNameAsync(int userId, string name, int parentId)
        {
            List<AlbumEntity> albums;

            if (parentId == -1)
            {
                albums = await _context.Albums
                    .Where(a => a.UserId == userId &&
                                a.AlbumName.Contains(name))
                    .ToListAsync();
            }
            else
            {
                var albumIds = await GetAlbumHierarchyAsync(parentId);

                albums = await _context.Albums
                    .Where(a => albumIds.Contains(a.Id) &&
                                a.AlbumName.Contains(name)).ToListAsync();
            }

            return albums;
        }
    }
}
