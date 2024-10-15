using Entity.DTO.Operational;
using Entity.Model.Operational;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Service.Operational.Interface
{
    public interface ILiquidationService
    {
        Task<IEnumerable<LiquidationDto>> GetAll();
        Task<LiquidationDto> GetById(int id);
        Task Add(LiquidationDto liquidationDto);
        Task Update(LiquidationDto liquidationDto);
        Task Delete(int id);
        Task<List<Liquidation>> GetLiquidationsByPersonIdAsync(int personId);
        Task<IEnumerable<LiquidationDto>> GetLiquidationsByFarmIdAsync(int farmId);
    }
}
