﻿using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading.Tasks;
using Web.Net.Core.DTOs;
using Web.Net.Core.Entity;
using Web.Net.Core.InterfaceRepository;
using Web.Net.Core.InterfaceService;
using Web.Net.Core.Shared;
using Web.Net.Data.Repositories;

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

        public async Task<Result<FileDto>> AddFileAsync(FileDto entity, int albumId)
        {
            bool isNameExist = await IsNameExist(entity.UserId, entity.Name);

            if (isNameExist)
                return Result<FileDto>.BadRequest("File with this name already exists.");

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

            // אם הגיע albumId תקין - קושר אותו
            if (albumId != -1)
            {
                var album = await _repositoryManager.Albums.GetByIdAsync(albumId);
                if (album == null)
                    return Result<FileDto>.BadRequest("Album not found.");
                file.Albums.Add(album);
            }

            await _repositoryManager.Files.AddAsync(file);
            await _repositoryManager.Save();

            await AddTagToFileAsync(file.Id, tag.Id);

            return Result<FileDto>.Success(_mapper.Map<FileDto>(file));
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

        public async Task<Result<FileDto>> UpdateFileAsync(int userId, int fileId, string newName)
        {
            // שליפת כל האלבומים שהקובץ נמצא בהם
            var fileAlbums = await _repositoryManager.Files.GetByIdAsync(fileId);
            var albums = fileAlbums.Albums;

            // בדיקה אם השם קיים באחד מהאלבומים של הקובץ
            foreach (var album in albums)
            {
                bool isNameExistInAlbum = await IsFileNameExistInAlbumAsync(album.Id, newName);
                if (isNameExistInAlbum)
                    return Result<FileDto>.BadRequest("File with this name already exists in one of its albums.");
            }

            // עדכון שם הקובץ
            var result = await _repositoryManager.Files.UpdateFileNameAsync(fileId, newName);
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

        private async Task<bool> IsFileNameExistInAlbumAsync(int albumId, string newName)
        {
            // שליפת כל הקבצים באלבום הספציפי
            var files = await _repositoryManager.Albums.GetFilesByAlbumIdAsync(albumId);

            // בדיקה אם קיים קובץ עם שם זהה (בהשוואה לא משנה רגישות לרישיות)
            var fileExists = files.Any(f => f.DisplayName.Equals(newName, StringComparison.OrdinalIgnoreCase) || f.Name.Equals(newName, StringComparison.OrdinalIgnoreCase));

            return fileExists;
        }

        public async Task<Result<int>> RemoveFileFromAlbumAsync(int fileId, int albumId)
        {
            var files = await _repositoryManager.Files.GetFullAsync();
            var file = files.FirstOrDefault(f => f.Id == fileId);

            if (file == null)
                return Result<int>.Failure("File not found");

            if (albumId == -1)
            {
                file.IsDeleted = true;
                await _repositoryManager.Save();
                return Result<int>.Success(file.Id);
            }

            var album = file.Albums.FirstOrDefault(a => a.Id == albumId);
            if (album == null)
                return Result<int>.Failure("File is not part of this album");

            file.Albums.Remove(album);

            if (!file.Albums.Any())
            {
                file.IsDeleted = true;
            }

            await _repositoryManager.Save();
            return Result<int>.Success(file.Id);
        }

        public async Task<Result<List<FileDto>>> GetDeletedFilesAsync()
        {
            var deletedFiles = await _repositoryManager.Files.GetDeletedFilesAsync();

            return Result<List<FileDto>>.Success(_mapper.Map<List<FileDto>>(deletedFiles));

        }

        public async Task<Result<bool>> RecycleFile(int fileId)
        {
            var file =await _repositoryManager.Files.GetByIdAsync(fileId);
            if (file == null)
                return Result<bool>.NotFound("File not found.");
            file.IsDeleted = false;
            await _repositoryManager.Save();
            return Result<bool>.Success(true);
        }

        public async Task<Result<List<FileDto>>> SearchFilesByNameAsync(string name, int parentId)
        {
            var list= await _repositoryManager.Files.SearchFilesByNameAsync(name, parentId);

            return Result<List<FileDto>>.Success(_mapper.Map<List<FileDto>>(list));
        }
    }
}
