using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Web.Net.Core.Entity;
using Web.Net.Core.InterfaceRepository;
using Web.Net.Core.Shared;

namespace Web.Net.Core.InterfaceService
{
    public interface IUserImageEditCountService
    {
        Task<Result<int>> GetEditCountAsync(int userId);
        Task<Result<bool>> IncrementEditCountAsync(int userId);
    }
}
