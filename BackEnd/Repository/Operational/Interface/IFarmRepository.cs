using Entity.Model.Operational;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Repository.Operational.Interface
{
    public interface IFarmRepository
    {
        Task<IEnumerable<Farm>> GetAll();
        
        Task<Farm> GetById(int id);
        Task Add(Farm farm);
        Task Update(Farm farm);
        Task Delete(int id);
        Farm GetByCodigoUnico(string codigoUnico);

        Task<Farm> GetFarmByPersonIdAsync(int personId);
    }
}
