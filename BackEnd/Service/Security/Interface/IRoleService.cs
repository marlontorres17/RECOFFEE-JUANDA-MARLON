using Entity.DTO.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Security.Interface
{
    public interface IRoleService
    {
        Task<IEnumerable<RoleDto>> GetAll();
        Task<RoleDto> GetById(int id);
        Task Add(RoleDto roleDto);
        Task Update(RoleDto roleDto);
        Task Delete(int id);

    }
}
