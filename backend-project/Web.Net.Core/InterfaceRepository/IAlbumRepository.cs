﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Web.Net.Core.Entity;

namespace Web.Net.Core.InterfaceRepository
{
    public interface IAlbumRepository:IRepository<AlbumEntity>
    {
        Task<IEnumerable<AlbumEntity>> GetFullAsync();

        void DeleteAlbumAsync(int albumId);

        Task<AlbumEntity> UpdateAlbumNameAsync(int albumId, string newName);

        Task<bool> AddFileToAlbumAsync(int albumId, int fileId);

        Task<List<FileEntity>> GetFilesByAlbumIdAsync(int albumId);

        Task<List<AlbumEntity>> GetAlbumsByUserIdAsync(int userId);
    }
}
