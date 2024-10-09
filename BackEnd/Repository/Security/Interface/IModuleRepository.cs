using Entity.Model.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Security.Interface
{
    public interface IModuleRepository
    {
        Task<IEnumerable<Module>> GetAll();
        Task<Module> GetById(int id);
        Task Add(Module module);
        Task Update(Module module);
        Task Delete(int id);
    }
}
