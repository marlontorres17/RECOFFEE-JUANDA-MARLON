using Entity.DTO.Operational;
using Entity.Model.Operational;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Operational.Interface
{
    public interface ICollectorFarmService
    {
        Task<IEnumerable<CollectorFarmDto>> GetAll();
        Task<CollectorFarmDto> GetById(int id);
        Task Add(CollectorFarmDto collectorFarmDto);
        Task Update(CollectorFarmDto collectorFarmDto);
        Task Delete(int id);
        Task<IEnumerable<CollectorDto>> GetCollectorsByFarmCode(string farmCode);

        Task<Farm> GetFarmByPersonIdAsync(int personId);
        Task<List<CollectorFarm>> GetCollectorFarmsByPersonIdAsync(int personId);

        Task<IEnumerable<CollectorFarmDto>> GetCollectorFarmsByPersonIdAsyncU(int personId);



    }
}
