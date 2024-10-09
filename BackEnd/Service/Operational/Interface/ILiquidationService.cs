using Entity.DTO.Operational;
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
    }
}
