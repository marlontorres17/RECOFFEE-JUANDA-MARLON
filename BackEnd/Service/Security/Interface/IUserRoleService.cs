using Entity.DTO.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Security.Interface
{
    public interface IUserRoleService
    {
        Task<IEnumerable<UserRoleDto>> GetAll();
        Task<UserRoleDto> GetById(int id);
        Task Add(UserRoleDto userRoleDto);
        Task Update(UserRoleDto userRoleDto);
        Task Delete(int id);
    }
}
