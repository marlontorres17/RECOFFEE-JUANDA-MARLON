using Entity.Model.Parameter;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Parameter.Interface
{
    public interface ICityRepository
    {
        Task<IEnumerable<City>> GetAll();
        Task<City> GetById(int id);
        Task Add(City city);
        Task Update(City city);
        Task Delete(int id);
    }
}
