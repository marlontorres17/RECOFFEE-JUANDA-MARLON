using Entity.DTO.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Security.Interface
{
    public interface IModuleService
    {
        Task<IEnumerable<ModuleDto>> GetAll();
        Task<ModuleDto> GetById(int id);
        Task Add(ModuleDto moduleDto);
        Task Update(ModuleDto moduleDto);
        Task Delete(int id);
    }
}
