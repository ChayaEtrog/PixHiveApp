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
        private readonly IRepositoryManager _repositoryManager=repositoryManager;
        private readonly IMapper _mapper=mapper;

        public async Task<Result<TagDto>> AddTagAsync(TagDto entity)
        {
            var newTag = CapitalizeFirstLetter(entity.TagName);
            var existingTag = await _repositoryManager.Tags.GetTagByNameAsync(newTag);

            if (existingTag != null)
            {
                return Result<TagDto>.Success(_mapper.Map<TagDto>(existingTag));
            }

            entity.TagName = newTag;
            var tag = _mapper.Map<TagEntity>(entity);
            await _repositoryManager.Tags.AddAsync(tag);
            await _repositoryManager.Save();

            return Result<TagDto>.Success(_mapper.Map<TagDto>(tag));
        }

        public static string CapitalizeFirstLetter(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
                return input;

            return char.ToUpper(input[0]) + input.Substring(1).ToLower();
        }


        public async Task<Result<TagDto>> DeleteTagAsync(int tagId)
        {
            var tag = await _repositoryManager.Tags.GetByIdAsync(tagId);
            if (tag == null)
                return Result<TagDto>.NotFound("Tag not found.");

            if (tag.TagName == "DefultTag")
                return Result<TagDto>.BadRequest("Cant delete the defult tag.");

            await _repositoryManager.Tags.DeleteAsync(tag);
            await _repositoryManager.Save();

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
           await _repositoryManager.Save();
            return Result<TagDto>.Success(_mapper.Map<TagDto>(result)); 
        }

        public async Task<Result<List<TagDto>>> GetUnassignedTagsAsync(int fileId)
        {
            var allTags = await _repositoryManager.Tags.GetAllAsync();

            var files = await _repositoryManager.Files.GetFullAsync();
            var file = files.FirstOrDefault(f=>f.Id==fileId);

            if (file == null)
                return Result<List<TagDto>>.Failure("File not found");

            var unassignedTags = allTags
                .Where(tag => !file.Tags.Any(ft => ft.Id == tag.Id))
                .ToList();

            return Result<List<TagDto>>.Success(_mapper.Map<List<TagDto>>(unassignedTags));
        }
    }
}
