using Entity.DTO.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Security.Interface
{
    public interface IViewService
    {
        Task<IEnumerable<ViewDto>> GetAll();
        Task<ViewDto> GetById(int id);
        Task Add(ViewDto viewDto);
        Task Update(ViewDto viewDto);
        Task Delete(int id);
    }
}
