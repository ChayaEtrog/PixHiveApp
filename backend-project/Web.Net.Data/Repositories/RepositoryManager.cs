﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Web.Net.Core.Entity;
using Web.Net.Core.InterfaceRepository;

namespace Web.Net.Data.Repositories
{
    public class RepositoryManager(DataContext context, 
                                   IUserRepository userRepository,
                                   IMessageRepository messageRepository,
                                   IFileRepository fileRepository,
                                   IAlbumRepository albumRepository,
                                   ITagRepository tagRepository,
                                   IRoleRepository roleRepository,
                                   IUserMessagesRepository userMessagesRepository,
                                   IUserImageEditCountRepository userImageEditCountRepository) : IRepositoryManager
    {
        private readonly DataContext _context = context;
        public IUserRepository Users => userRepository;
        public IMessageRepository Messages => messageRepository;
        public IAlbumRepository Albums => albumRepository;
        public IFileRepository Files => fileRepository;
        public ITagRepository Tags => tagRepository;
        public IRoleRepository Roles => roleRepository;
        public IUserMessagesRepository UserMessages => userMessagesRepository;
        public IUserImageEditCountRepository UserImageEditCount => userImageEditCountRepository;

        public async Task Save()
        {
           await _context.SaveChangesAsync();
        }
    }
}
