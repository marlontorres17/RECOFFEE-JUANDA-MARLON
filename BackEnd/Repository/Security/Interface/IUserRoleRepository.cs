using Entity.Model.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Security.Interface
{
    public interface IUserRoleRepository
    {
        Task<IEnumerable<UserRole>> GetAll();
        Task<UserRole> GetById(int id);
        Task Add(UserRole userRole);
        Task Update(UserRole userRole);
        Task Delete(int id);

        Task<Role> GetRoleByName(string roleName);

        Task<Role> GetRoleByNameU(string roleName);
        Task<UserRole> GetUserRoleByUserId(int userId);

    }
}
