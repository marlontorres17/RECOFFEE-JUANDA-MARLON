using Entity.DTO.Operational;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Web.Controllers.Operational.Interface
{
    public interface ILiquidationController
    {
        Task<ActionResult<IEnumerable<LiquidationDto>>> GetAll();
        Task<ActionResult<LiquidationDto>> GetById(int id);
        Task<IActionResult> Add(LiquidationDto liquidationDto);
        Task<IActionResult> Update(LiquidationDto liquidationDto);
        Task<IActionResult> Delete(int id);
        Task<IActionResult> CalculateLiquidation(int personId, DateTime startDate, DateTime endDate);
    }
}
