using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Web.Net.Core.Entity
{
    public class Role
    {
        public int Id { get; set; }

        public string RoleName { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        public List<UserEntity> UserRoles { get; set; } = new List<UserEntity>();

        public List<Permissions> RolePermissions { get; set; } = new List<Permissions>();
    }
}
