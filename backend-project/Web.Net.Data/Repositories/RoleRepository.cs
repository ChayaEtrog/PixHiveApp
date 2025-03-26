using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Web.Net.Core.Entity;
using Web.Net.Core.InterfaceRepository;

namespace Web.Net.Data.Repositories
{
    public class RoleRepository : Repository<Role>, IRoleRepository
    {

        private readonly DataContext _context;
        public RoleRepository(DataContext dataContext) : base(dataContext)
        {
            _context = dataContext;
        }

        public Role? GetByName(string roleName)
        {
            var role = _context.Roles.FirstOrDefault(r => r.RoleName == roleName);
            return role;
        }
    }
}
