using Entity.DTO.Operational;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Web.Controllers.Operational.Interface
{
    public interface ILotController
    {
        Task<ActionResult<IEnumerable<LotDto>>> GetAll();
        Task<ActionResult<LotDto>> GetById(int id);
        Task<IActionResult> Add(LotDto lotDto);
        Task<IActionResult> Update(LotDto lotDto);
        Task<IActionResult> Delete(int id);
    }
}
