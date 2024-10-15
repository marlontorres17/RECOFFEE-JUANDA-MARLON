using Entity.Model.Operational;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Repository.Operational.Interface
{
    public interface IBenefitRepository
    {
        Task<IEnumerable<Benefit>> GetAll();
        Task<Benefit> GetById(int id);
        Task Add(Benefit benefit);
        Task Update(Benefit benefit);
        Task Delete(int id);

        Task<List<Benefit>> GetBenefitsByFarmIdAsync(int farmId);
    }
}
