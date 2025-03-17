using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Web.Net.Core.Entity;

namespace Web.Net.Core.InterfaceRepository
{
    public interface IRoleRepository:IRepository<Role>
    {
        Role? GetByName(string roleName);
    }
}
