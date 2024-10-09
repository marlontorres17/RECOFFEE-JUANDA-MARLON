using Entity.Model.Operational;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Repository.Operational.Interface
{
    public interface ILotRepository
    {
        Task<IEnumerable<Lot>> GetAll();
        Task<Lot> GetById(int id);
        Task Add(Lot lot);
        Task Update(Lot lot);
        Task Delete(int id);
    }
}
