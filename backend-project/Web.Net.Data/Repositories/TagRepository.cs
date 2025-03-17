using Azure;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Web.Net.Core.Entity;
using Web.Net.Core.InterfaceRepository;

namespace Web.Net.Data.Repositories
{
    public class TagRepository : Repository<TagEntity>, ITagRepository
    {
        readonly DataContext _context;
        public TagRepository(DataContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TagEntity>> GetFullAsync()
        {
            return await _context.Tags
                  .Include(t => t.Files)
                  .ToListAsync();
        }

        public async Task<TagEntity> UpdateTagNameAsync(int tagId, string newName)
        {
            var tag = await _context.Tags.FindAsync(tagId);

            if (tag == null)
            {
                return null;
            }

            tag.TagName = newName;

            await _context.SaveChangesAsync();

            return tag;
        }

        public async Task<TagEntity> GetTagByNameAsync(string tagName)
        {
            return await _context.Tags
                    .Where(t => t.TagName.ToLower() == tagName.ToLower())
                    .FirstOrDefaultAsync();
        }
    }
}
