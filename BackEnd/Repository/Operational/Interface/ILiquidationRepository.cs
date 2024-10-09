using Entity.Model.Operational;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Repository.Operational.Interface
{
    public interface ILiquidationRepository
    {
        Task<IEnumerable<Liquidation>> GetAll();
        Task<Liquidation> GetById(int id);
        Task Add(Liquidation liquidation);
        Task Update(Liquidation liquidation);
        Task Delete(int id);
    }
}
