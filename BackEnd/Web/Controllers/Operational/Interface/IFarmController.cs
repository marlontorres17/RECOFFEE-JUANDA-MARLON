using Entity.DTO.Operational;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Web.Controllers.Operational.Interface
{
    public interface IFarmController
    {
        Task<ActionResult<IEnumerable<FarmDto>>> GetAll();
        Task<ActionResult<FarmDto>> GetById(int id);
        Task<IActionResult> Add(FarmDto farmDto);
        Task<IActionResult> Update(FarmDto farmDto);
        Task<IActionResult> Delete(int id);
    }
}
