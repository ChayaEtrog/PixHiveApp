using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Web.Net.Core.InterfaceRepository
{
    public interface IRepositoryManager
    {
        IUserRepository Users { get; }

        IAlbumRepository Albums { get; }

        IFileRepository Files { get; }

        ITagRepository Tags { get; }

        IMessageRepository Messages { get; }

        IRoleRepository Roles { get; }

        IUserMessagesRepository UserMessages { get; }

        Task Save();
    }
}
