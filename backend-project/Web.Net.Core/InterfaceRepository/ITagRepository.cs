using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Web.Net.Core.Entity;

namespace Web.Net.Core.InterfaceRepository
{
    public interface ITagRepository:IRepository<TagEntity>
    {
        Task<IEnumerable<TagEntity>> GetFullAsync();

        Task<TagEntity> UpdateTagNameAsync(int tagId, string newName);

        Task<TagEntity> GetTagByNameAsync(string tagName);
    }
}
