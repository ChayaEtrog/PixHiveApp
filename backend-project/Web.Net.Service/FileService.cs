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

namespace Web.Net.Service
{
    public class FileService : IFileService
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly IMapper _mapper;

        public FileService(IRepositoryManager repositoryManager, IMapper mapper)
        {
            _mapper = mapper;
            _repositoryManager = repositoryManager;
        }

        public async Task<Result<FileDto>> AddFileAsync(FileDto entity)
        {
            bool isNameExist = await IsNameExist(entity.UserId, entity.Name);

            if (!isNameExist)
            {
                var allowedFileTypes = new List<string> { "image/jpeg", "image/png", "image/gif", "image/bmp", "image/webp", "image/jpg" };
                if (!allowedFileTypes.Contains(entity.Type))
                    return Result<FileDto>.BadRequest("Invalid file type. Allowed types are: jpg, png, gif.");

                var maxSizeInMb = 10;
                if (entity.FileSize > maxSizeInMb * 1024 * 1024) 
                    return Result<FileDto>.BadRequest($"File size exceeds the maximum allowed size of {maxSizeInMb}MB.");
               
                entity.UploadedAt = DateTime.Now;
                entity.UpdateAt = DateTime.Now;
                entity.DisplayName = entity.Name;

                var tag = await _repositoryManager.Tags.GetTagByNameAsync("DefultTag");

                var file = _mapper.Map<FileEntity>(entity);
                await _repositoryManager.Files.AddAsync(file);
                await _repositoryManager.Save();

                await AddTagToFileAsync(file.Id, tag.Id);

                return Result<FileDto>.Success(_mapper.Map<FileDto>(file));
            }
            else
            {
                return Result<FileDto>.BadRequest("File with this name already exists.");
            }
        }


        public async Task<Result<FileDto>> DeleteFileAsync(int fileId)
        {
            var file = await _repositoryManager.Files.GetByIdAsync(fileId);
            if (file == null)
                return Result<FileDto>.NotFound("File not found.");

             _repositoryManager.Files.DeleteFileAsync(fileId);
            await _repositoryManager.Save();

            return Result<FileDto>.Success(null);
        }

        public async Task<Result<FileDto>> GetFileByIdAsync(int id)
        {
            var file = await _repositoryManager.Files.GetByIdAsync(id);
            if (file == null)
                return Result<FileDto>.NotFound("File not found.");

            return Result<FileDto>.Success(_mapper.Map<FileDto>(file)); 
        }

        public async Task<Result<IEnumerable<FileDto>>> GetFilesAsync()
        {
            var files = await _repositoryManager.Files.GetFullAsync();
            return Result<IEnumerable<FileDto>>.Success(_mapper.Map<List<FileDto>>(files));
        }

        public async Task<Result<FileDto>> UpdateFileAsync(int userId, int id, string newName)
        {
            bool isNameExist =await IsNameExist(userId, newName);

            if (isNameExist)
                return Result<FileDto>.BadRequest("File with this name already exists.");

            var result = await _repositoryManager.Files.UpdateFileNameAsync(id, newName);
            await _repositoryManager.Save();

            return Result<FileDto>.Success(_mapper.Map<FileDto>(result)); 
        }

        public async Task<Result<IEnumerable<FileDto>>> GetFilesByTagAndUserIdAsync(int userId, string tagName)
        {
            var files = await _repositoryManager.Files.GetFilesByTagAndUserIdAsync(userId, tagName);
            var fileDtos = _mapper.Map<IEnumerable<FileDto>>(files);

            return Result<IEnumerable<FileDto>>.Success(fileDtos);
        }

        public async Task<Result<IEnumerable<FileDto>>> GetFilesByDateAsync(DateTime? startDate = null, DateTime? endDate = null)
        {
            var files = await _repositoryManager.Files.GetFilesByDateAsync(startDate, endDate);
            return Result<IEnumerable<FileDto>>.Success(_mapper.Map<IEnumerable<FileDto>>(files)); // Return files wrapped in Result
        }

        public async Task<Result<List<FileDto>>> GetFilesByUserIdAsync(int userId)
        {
            var files = await _repositoryManager.Files.GetFilesByUserIdAsync(userId);
            return Result<List<FileDto>>.Success(_mapper.Map<List<FileDto>>(files)); 
        }

        public async Task<Result<bool>> AddTagToFileAsync(int fileId, int tagId)
        {
            var success = await _repositoryManager.Files.AddTagToFileAsync(fileId, tagId);
            return Result<bool>.Success(success); 
        }

        public async Task<Result<bool>> RemoveTagFromFileAsync(int fileId, int tagId)
        {
            var success = await _repositoryManager.Files.RemoveTagFromFileAsync(fileId, tagId);
            return Result<bool>.Success(success); 
        }

        public async Task<Result<List<TagDto>>> GetTagsByFileIdAsync(int fileId)
        {
            var file = await _repositoryManager.Files.GetByIdAsync(fileId);
            if (file == null)
                return Result<List<TagDto>>.NotFound("File not found.");

            var tags = await _repositoryManager.Files.GetTagsByFileIdAsync(fileId);
            return Result<List<TagDto>>.Success(_mapper.Map<List<TagDto>>(tags)); 
        }

        public async Task<Result<List<FileDto>>> GetRootFilesByUserIdAsync(int userId)
        {
            var files = await _repositoryManager.Files.GetRootFilesByUserId(userId);
   
            return Result<List<FileDto>>.Success(_mapper.Map<List<FileDto>>(files));
        }

        private async Task<bool> IsNameExist(int userId, string newName)
        {
            var files = await _repositoryManager.Files.GetFilesByUserIdAsync(userId);
            var fileExists = files.Any(f => f.DisplayName.Equals(newName, StringComparison.OrdinalIgnoreCase) || f.Name.Equals(newName, StringComparison.OrdinalIgnoreCase));

            if (fileExists)
            {
               return true;
            }

            return false;
        }


    }
}
