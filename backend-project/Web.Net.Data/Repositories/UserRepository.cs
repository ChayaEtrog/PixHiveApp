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
                .Include(u => u.UserMessages)
    .Include(u => u.SentMessages)
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
                .Include(u => u.UserMessages)    // הודעות שהוא קיבל
                .Include(u => u.SentMessages)    // הודעות שהוא שלח
                .FirstOrDefault(u => u.Id == userId);

            if (user == null)
                return;

            var fileIds = user.Files.Select(f => f.Id).ToList();
            var albumIds = user.Albums.Select(a => a.Id).ToList();

            // 1️⃣ מחיקת רשומות מטבלת האמצע AlbumFile
            var albumFiles = _context.Set<Dictionary<string, object>>("AlbumFile")
                .Where(af => fileIds.Contains((int)af["FilesId"]) || albumIds.Contains((int)af["AlbumsId"]))
                .ToList();
            _context.RemoveRange(albumFiles);

            // 2️⃣ מחיקת רשומות מטבלת האמצע FileEntityTagEntity
            var fileTags = _context.Set<Dictionary<string, object>>("FileEntityTagEntity")
                .Where(ft => fileIds.Contains((int)ft["FilesId"]))
                .ToList();
            _context.RemoveRange(fileTags);

            // 3️⃣ מחיקת קבצים
            _context.Files.RemoveRange(user.Files);

            // 4️⃣ מחיקת אלבומים
            _context.Albums.RemoveRange(user.Albums);

            // 5️⃣ מחיקת הודעות שנשלחו (SenderId - אם הוא Restrict)
            _context.Messages.RemoveRange(user.SentMessages);

            // 5️⃣.1 מחיקת ההודעות שהמשתמש קיבל (כדי למנוע שגיאת FK על ReceiverId)
            var receivedMessages = _context.Messages.Where(m => m.ReceiverId == userId).ToList();
            _context.Messages.RemoveRange(receivedMessages);
            _context.SaveChanges();

            // 7️⃣ מחיקת המשתמש
            _context.Users.Remove(user);

            // 💾 שמירת כל השינויים ביחד
            _context.SaveChanges();
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

