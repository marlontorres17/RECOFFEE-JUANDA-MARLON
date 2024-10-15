using Entity.Model.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Security.Interface
{
    public interface IViewRepository
    {
        Task<IEnumerable<View>> GetAll();
        Task<View> GetById(int id);
        Task Add(View view);
        Task Update(View view);
        Task Delete(int id);
    }
}
