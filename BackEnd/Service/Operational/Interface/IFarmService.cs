using Entity.DTO.Operational;
using Entity.Model.Operational;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Service.Operational.Interface
{
    public interface IFarmService
    {
        Task<IEnumerable<FarmDto>> GetAll();
        Task<FarmDto> GetById(int id);
        Task Add(FarmDto farmDto);
        Task Update(FarmDto farmDto);
        Task Delete(int id);

        Task<Farm> GetFarmByPersonIdAsync(int personId);

        Task<List<Farm>> GetFarmsByPersonsIdAsync(int personId);



    }
}
