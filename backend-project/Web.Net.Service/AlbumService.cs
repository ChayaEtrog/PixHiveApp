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

        public async Task<Result<AlbumDto>> DeleteAlbumAsync(int albumId)
        {
            try
            {
                var album = await _repositoryManager.Albums.GetByIdAsync(albumId);
                if (album == null)
                    return Result<AlbumDto>.NotFound("Album not found");

                _repositoryManager.Albums.DeleteAlbumAsync(albumId);
               await _repositoryManager.Save();

                return Result<AlbumDto>.Success(null); // Return success with null albumDto, since album was deleted
            }
            catch (Exception ex)
            {
                return Result<AlbumDto>.Failure($"Error deleting album: {ex.Message}");
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

        public async Task<Result<bool>> AddFileToAlbumAsync(int albumId, int fileId)
        {
            try
            {
                var success = await _repositoryManager.Albums.AddFileToAlbumAsync(albumId, fileId);
                await _repositoryManager.Save();
                return Result<bool>.Success(success); 
            }
            catch (Exception ex)
            {
                return Result<bool>.Failure($"Error adding file to album: {ex.Message}");
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
    }
}
