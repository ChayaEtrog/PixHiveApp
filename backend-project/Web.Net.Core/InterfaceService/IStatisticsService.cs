using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Web.Net.Core.DTOs;
using Web.Net.Core.Shared;

namespace Web.Net.Core.InterfaceService
{
    public interface IStatisticsService
    {
        Task<Result<SystemStatisticsDto>> GetSystemStatisticsAsync();

        Task<Result<IEnumerable<UserStatisticsDto>>> GetUserStatisticsAsync();
    }
}
