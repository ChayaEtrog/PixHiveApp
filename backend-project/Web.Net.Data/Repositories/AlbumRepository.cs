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
        public async Task<IEnumerable<AlbumEntity>> GetFullAsync()
        {
            return await _context.Albums
        .Include(a => a.User)
        .Include(a => a.Files).ToListAsync();

        }

        public void DeleteAlbumAsync(int albumId)
        {

            var album = _context.Albums
                .Include(a => a.Files)
                .Include(a => a.User)
                .FirstOrDefault(a => a.Id == albumId);

            if (album == null) return;

            var childAlbums = _context.Albums.Where(a => a.ParentId == albumId).ToList();
            foreach (var child in childAlbums)
            {
                DeleteAlbumAsync(child.Id);
            }

            album.Files.Clear();
            _context.SaveChanges();

            _context.Albums.Remove(album);
            _context.SaveChanges();
        }

        public async Task<AlbumEntity> UpdateAlbumNameAsync(int albumId, string newName)
        {
            var album = await _context.Albums.FindAsync(albumId);

            if (album == null)
            {
                return null;
            }

            album.AlbumName = newName;

            await _context.SaveChangesAsync();

            return album;
        }

        public async Task<bool> AddFileToAlbumAsync(int albumId, int fileId)
        {
            var album = await _context.Albums
                .Include(a => a.Files)
                .FirstOrDefaultAsync(a => a.Id == albumId);

            if (album == null) return false;

            var file = await _context.Files.FindAsync(fileId);
            if (file == null) return false;

            if (!album.Files.Contains(file))
            {
                file.Albums.Add(album);
                album.Files.Add(file);
                await _context.SaveChangesAsync();
            }

            return true;
        }

        public async Task<List<FileEntity>> GetFilesByAlbumIdAsync(int albumId )
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
    }
}
