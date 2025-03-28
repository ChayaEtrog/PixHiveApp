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
    public interface ITagService
    {
        Task<Result<IEnumerable<TagDto>>> GetTagsAsync();

        Task<Result<TagDto>> GetTagByIdAsync(int id);

        Task<Result<TagDto>> AddTagAsync(TagDto entity);

        Task<Result<TagDto>> UpdateTagAsync(int id, string newName);

        Task<Result<TagDto>> DeleteTagAsync(int tagId);

        Task<Result<List<TagDto>>> GetUnassignedTagsAsync(int fileId);
    }
}
