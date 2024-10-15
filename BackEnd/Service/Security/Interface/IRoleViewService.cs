using Entity.DTO.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Security.Interface
{
    public interface IRoleViewService
    {
        Task<IEnumerable<RoleViewDto>> GetAll();
        Task<RoleViewDto> GetById(int id);
        Task Add(RoleViewDto roleViewDto);
        Task Update(RoleViewDto roleViewDto);
        Task Delete(int id);
    }
}
