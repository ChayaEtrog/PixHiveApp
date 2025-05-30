﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Web.Net.Core.DTOs;
using Web.Net.Core.Entity;
using Web.Net.Core.Shared;

namespace Web.Net.Core.InterfaceService
{
    public interface IAlbumService
    {
        Task<Result<IEnumerable<AlbumDto>>> GetAlbumsAsync();

        Task<Result<AlbumDto>> GetAlbumByIdAsync(int id);

        Task<Result<AlbumDto>> AddAlbumAsync(AlbumDto entity);

        Task<Result<AlbumDto>> UpdateAlbumAsync(int userId, int id, string newName);

        Task<Result<FileDto>> AddFileToAlbumAsync(int albumId, int fileId);

        Task<Result<List<FileDto>>> GetFilesByAlbumIdAsync(int albumId);

        Task<Result<List<AlbumDto>>> GetAlbumsByUserIdAsync(int userId);

        Task<Result<List<AlbumDto>>> GetChildAlbumsAsync(int userId, int? parentId = null);

        Task<Result<int>> DeleteAlbumAsync(int albumId);

        Task<Result<IEnumerable<AlbumDto>>> GetAlbumsByDateAsync(int userId, DateTime? startDate = null, DateTime? endDate = null, int? parentAlbumId = null);

        Task<Result<List<AlbumDto>>> SearchAlbumsByNameAsync(int userId, string name, int parentId);
    }
}
