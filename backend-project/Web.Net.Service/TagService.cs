using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Web.Net.Core.DTOs;
using Web.Net.Core.Entity;
using Web.Net.Core.InterfaceRepository;
using Web.Net.Core.InterfaceService;
using Web.Net.Core.Shared;
using static System.Net.Mime.MediaTypeNames;

namespace Web.Net.Service
{
    public class TagService(IRepositoryManager repositoryManager, IMapper mapper) : ITagService
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly IMapper _mapper;

        public async Task<Result<TagDto>> AddTagAsync(TagDto entity)
        {
            var existingTag = await _repositoryManager.Tags.GetTagByNameAsync(entity.TagName);

            if (existingTag != null)
            {
                return Result<TagDto>.Success(_mapper.Map<TagDto>(existingTag));
            }

            var tag = _mapper.Map<TagEntity>(entity);
            await _repositoryManager.Tags.AddAsync(tag);
            _repositoryManager.Save();

            return Result<TagDto>.Success(_mapper.Map<TagDto>(tag));
        }

        public async Task<Result<TagDto>> DeleteTagAsync(int tagId)
        {
            var tag = await _repositoryManager.Tags.GetByIdAsync(tagId);
            if (tag == null)
                return Result<TagDto>.NotFound("Tag not found.");

            if (tag.TagName == "DefultTag")
                return Result<TagDto>.BadRequest("Cant delete the defult tag.");

            await _repositoryManager.Tags.DeleteAsync(tag);
            _repositoryManager.Save();

            return Result<TagDto>.Success(null); 
        }

        public async Task<Result<TagDto>> GetTagByIdAsync(int id)
        {
            var tag = await _repositoryManager.Tags.GetByIdAsync(id);
            if (tag == null)
                return Result<TagDto>.NotFound("Tag not found.");

            return Result<TagDto>.Success(_mapper.Map<TagDto>(tag)); 
        }

        public async Task<Result<IEnumerable<TagDto>>> GetTagsAsync()
        {
            var tags = await _repositoryManager.Tags.GetFullAsync();
            return Result<IEnumerable<TagDto>>.Success(_mapper.Map<List<TagDto>>(tags));
        }

        public async Task<Result<TagDto>> UpdateTagAsync(int id, string newName)
        {
            var tag = await _repositoryManager.Tags.GetByIdAsync(id);
            if (tag == null)
                return Result<TagDto>.NotFound("Tag not found.");

            var result = await _repositoryManager.Tags.UpdateTagNameAsync(id, newName);
            _repositoryManager.Save();
            return Result<TagDto>.Success(_mapper.Map<TagDto>(result)); 
        }
    }
}
