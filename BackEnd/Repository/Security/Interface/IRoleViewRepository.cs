using Entity.Model.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Security.Interface
{
    public interface IRoleViewRepository
    {
        Task<IEnumerable<RoleView>> GetAll();
        Task<RoleView> GetById(int id);
        Task Add(RoleView roleView);
        Task Update(RoleView roleView);
        Task Delete(int id);
    }
}
