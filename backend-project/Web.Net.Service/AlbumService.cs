﻿using AutoMapper;
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
    public class AlbumService : IAlbumService
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly IMapper _mapper;

        public AlbumService(IRepositoryManager repositoryManager, IMapper mapper)
        {
            _mapper = mapper;
            _repositoryManager = repositoryManager;
        }

        public async Task<Result<AlbumDto>> AddAlbumAsync(AlbumDto entity)
        {
            try
            {
               bool isNameExist= await IsNameExist(entity.UserId, entity.AlbumName);

                if (!isNameExist)
                {
                    entity.CreatedAt = DateTime.Now;

                    var album = _mapper.Map<AlbumEntity>(entity);
                    await _repositoryManager.Albums.AddAsync(album);
                    await _repositoryManager.Save();

                    return Result<AlbumDto>.Success(_mapper.Map<AlbumDto>(album));
                }
                else
                {
                    return Result<AlbumDto>.BadRequest("Album with this name already exists.");
                }
            }
            catch (Exception ex)
            {
                return Result<AlbumDto>.Failure($"Error adding album: {ex.Message}");
            }
        }

        public async Task<Result<AlbumDto>> GetAlbumByIdAsync(int id)
        {
            try
            {
                var album = await _repositoryManager.Albums.GetByIdAsync(id);
                if (album == null)
                {
                    return Result<AlbumDto>.NotFound("Album not found.");
                }

                return Result<AlbumDto>.Success(_mapper.Map<AlbumDto>(album));
            }
            catch (Exception ex)
            {
                return Result<AlbumDto>.Failure($"Error fetching album by ID: {ex.Message}");
            }
        }

        public async Task<Result<IEnumerable<AlbumDto>>> GetAlbumsAsync()
        {
            try
            {
                var albums = await _repositoryManager.Albums.GetFullAsync();
                if(albums==null)
                    return Result<IEnumerable<AlbumDto>>.Success(new List<AlbumDto>());

                return Result<IEnumerable<AlbumDto>>.Success(_mapper.Map<List<AlbumDto>>(albums));
            }
            catch (Exception ex)
            {
                return Result<IEnumerable<AlbumDto>>.Failure($"Error fetching albums: {ex.Message}");
            }
        }

        public async Task<Result<AlbumDto>> UpdateAlbumAsync(int userId, int id, string newName)
        {
            try
            {
                bool isNameExist = await IsNameExist(userId, newName);
                if (!isNameExist)
                {
                    var result = await _repositoryManager.Albums.UpdateAlbumNameAsync(id, newName);

                    if (result == null)
                    {
                        return Result<AlbumDto>.NotFound("Album not found.");
                    }
                    await _repositoryManager.Save();
                    return Result<AlbumDto>.Success(_mapper.Map<AlbumDto>(result));
                }
                return Result<AlbumDto>.BadRequest("Album with this name already exists.");
            }
            catch (Exception ex)
            {
                return Result<AlbumDto>.Failure($"Error updating album: {ex.Message}");
            }
        }

        public async Task<Result<FileDto>> AddFileToAlbumAsync(int albumId, int fileId)
        {
            try
            {
                var file = await _repositoryManager.Files.GetByIdAsync(fileId);
                if (file == null)
                {
                    return Result<FileDto>.Failure("File not found");
                }

                bool isFileNameExistInAlbum = await IsFileNameExistInAlbumAsync(albumId, file.DisplayName); 
                if (isFileNameExistInAlbum)
                {
                    return Result<FileDto>.Failure("File with the same name already exists in this album.");
                }

                var response = await _repositoryManager.Albums.AddFileToAlbumAsync(albumId, fileId);
                if (response == null)
                {
                    return Result<FileDto>.Failure("File or album not found.");
                }

                await _repositoryManager.Save();
                return Result<FileDto>.Success(_mapper.Map<FileDto>(response));
            }
            catch (Exception ex)
            {
                return Result<FileDto>.Failure($"Error adding file to album: {ex.Message}");
            }
        }


        public async Task<Result<List<FileDto>>> GetFilesByAlbumIdAsync(int albumId)
        {
            try
            {
                var files = await _repositoryManager.Albums.GetFilesByAlbumIdAsync(albumId);
                return Result<List<FileDto>>.Success(_mapper.Map<List<FileDto>>(files));
            }
            catch (Exception ex)
            {
                return Result<List<FileDto>>.Failure($"Error fetching files by album ID: {ex.Message}");
            }
        }

        public async Task<Result<List<AlbumDto>>> GetAlbumsByUserIdAsync(int userId)
        {
            try
            {
                var result = await _repositoryManager.Albums.GetAlbumsByUserIdAsync(userId);
                return Result<List<AlbumDto>>.Success(_mapper.Map<List<AlbumDto>>(result));
            }
            catch (Exception ex)
            {
                return Result<List<AlbumDto>>.Failure($"Error fetching albums by user ID: {ex.Message}");
            }
        }

        private async Task<bool> IsNameExist(int userId, string newName)
        {
            var albums = await _repositoryManager.Albums.GetAlbumsByUserIdAsync(userId);
            var albumExists = albums.Any(a => a.AlbumName.Equals(newName, StringComparison.OrdinalIgnoreCase));

            if (albumExists)
            {
                return true;
            }
            return false;
        }

        public async Task<Result<List<AlbumDto>>> GetChildAlbumsAsync(int userId,int? parentId = null)
        {
            var albums = await _repositoryManager.Albums.GetChildAlbumsByUserId(userId,parentId);

            return Result<List<AlbumDto>>.Success(_mapper.Map<List<AlbumDto>>(albums));
        }

        private async Task<bool> IsFileNameExistInAlbumAsync(int albumId, string newName)
        {
            var files = await _repositoryManager.Albums.GetFilesByAlbumIdAsync(albumId);

            var fileExists = files.Any(f => f.DisplayName.Equals(newName, StringComparison.OrdinalIgnoreCase) || f.Name.Equals(newName, StringComparison.OrdinalIgnoreCase));

            return fileExists;
        }

        public async Task<Result<int>> DeleteAlbumAsync(int albumId)
        {
            var albums = await _repositoryManager.Albums.GetFullAsync();
            var album = albums.FirstOrDefault(a => a.Id == albumId);

            if (album == null)
                return Result<int>.Failure("Album not found");

            foreach (var file in album.Files.ToList()) 
            {
                var files = await _repositoryManager.Files.GetFullAsync();
                var fileWithAlbums = files.FirstOrDefault(f => f.Id == file.Id);

                if (fileWithAlbums == null)
                    continue;

                if (fileWithAlbums.Albums.Count == 1)
                {
                    file.IsDeleted = true;
                }
            }

            await _repositoryManager.Albums.DeleteAlbumAsync(album.Id);
            await _repositoryManager.Save();

            return Result<int>.Success(album.Id);
        }

        public async Task<Result<List<AlbumDto>>> SearchAlbumsByNameAsync(int userId, string name, int parentId)
        {
            var list = await _repositoryManager.Albums.SearchAlbumsByNameAsync(userId, name, parentId);

            return Result<List<AlbumDto>>.Success(_mapper.Map<List<AlbumDto>>(list));
        }

        public async Task<Result<IEnumerable<AlbumDto>>> GetAlbumsByDateAsync(int userId, DateTime? startDate = null, DateTime? endDate = null, int? parentAlbumId = null)
        {
            var files = await _repositoryManager.Albums.GetAlbumsByDateAsync(userId, startDate, endDate, parentAlbumId);
            return Result<IEnumerable<AlbumDto>>.Success(_mapper.Map<IEnumerable<AlbumDto>>(files));
        }
    }
}
