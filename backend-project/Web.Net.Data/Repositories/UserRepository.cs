using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Web.Net.Core.Entity;
using Web.Net.Core.InterfaceRepository;

namespace Web.Net.Data.Repositories
{
    public class UserRepository : Repository<UserEntity>, IUserRepository
    {
        readonly DataContext _context;
        public UserRepository(DataContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<UserEntity>> GetFullAsync()
        {
            return await _context.Users
                .Include(u => u.Albums)
                .Include(u => u.Files)
                .Include(u => u.Messages)
                .ToListAsync();
        }

        public async Task<UserEntity> GetFullUserByEmail(string UserEmail)
        {
            return await _context.Users
        .Include(u => u.UserRoles)  // טוען את רשימת התפקידים
        .FirstOrDefaultAsync(u => u.Email == UserEmail);
        }

        public void DeleteStudent(int userId)
        {
            var user = _context.Users
    .Include(u => u.Files)
    .Include(u => u.Albums)
    .Include(u => u.Messages)
    .FirstOrDefault(u => u.Id == userId);

            if (user != null)
            {
                // 1️⃣ מחיקת כל הרשומות בטבלת AlbumFile עבור הקבצים של המשתמש
                var fileIds = user.Files.Select(f => f.Id).ToList();
                var albumIds = user.Albums.Select(a => a.Id).ToList();

                var albumFiles = _context.Set<Dictionary<string, object>>("AlbumFile")
                    .Where(af => fileIds.Contains((int)af["FilesId"]) || albumIds.Contains((int)af["AlbumsId"]))
                    .ToList();

                _context.RemoveRange(albumFiles);
                _context.SaveChanges();

                // 2️⃣ מחיקת כל הקבצים של המשתמש
                _context.Files.RemoveRange(user.Files);
                _context.SaveChanges();

                // 3️⃣ מחיקת כל האלבומים של המשתמש
                _context.Albums.RemoveRange(user.Albums);
                _context.SaveChanges();

                // 4️⃣ מחיקת המשתמש עצמו
                _context.Users.Remove(user);
                _context.SaveChanges();
            }

        }

        public async Task<UserEntity> UpdateUserAsync(UserEntity user, int index)
        {
            try
            {
                var existing = await GetByIdAsync(index);
                if (existing == null)
                    return null;

                existing.UserName = user.UserName;
                existing.Email = user.Email;
                existing.PhoneNumber = user.PhoneNumber;

                await _context.SaveChangesAsync();
                return existing;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating drawing: {ex.Message}");
                return null;
            }
        }

        public UserEntity GetUserWithRoles(string usernameOrEmail)
        {
            List<UserEntity> users = _context.Users
                .Include(u => u.UserRoles).ToList();
            var user = users.FirstOrDefault(u => u.UserName == usernameOrEmail || u.Email == usernameOrEmail);

            return user;
        }

        public IEnumerable<Role> GetUserRoles(int userId)
        {
            var user = _context.Users
                .Include(u => u.UserRoles)
                .FirstOrDefault(u => u.Id == userId);

            return user?.UserRoles ?? Enumerable.Empty<Role>();
        }

        public async Task<UserEntity> GetUserByIdAsync(int userId)
        {
            return await _context.Users
                .Include(u => u.UserRoles) // מבטיח שהתפקידים נטענים יחד עם המשתמש
                .FirstOrDefaultAsync(u => u.Id == userId);
        }
    }
}

