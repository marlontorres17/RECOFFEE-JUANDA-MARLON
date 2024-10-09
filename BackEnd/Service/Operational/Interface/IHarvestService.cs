using Entity.DTO.Operational;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Service.Operational.Interface
{
    public interface IHarvestService
    {
        Task<IEnumerable<HarvestDto>> GetAll();
        Task<HarvestDto> GetById(int id);
        Task Add(HarvestDto harvestDto);
        Task Update(HarvestDto harvestDto);
        Task Delete(int id);
    }
}
