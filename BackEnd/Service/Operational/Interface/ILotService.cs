using Entity.DTO.Operational;
using Entity.Model.Operational;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Service.Operational.Interface
{
    public interface ILotService
    {
        Task<IEnumerable<LotDto>> GetAll();
        Task<LotDto> GetById(int id);
        Task Add(LotDto lotDto);
        Task Update(LotDto lotDto);
        Task Delete(int id);

        Task<List<Lot>> GetLotsByFarmIdAsync(int farmId);
    }
}
