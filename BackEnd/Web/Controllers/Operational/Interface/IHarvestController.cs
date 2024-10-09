using Entity.DTO.Operational;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Web.Controllers.Operational.Interface
{
    public interface IHarvestController
    {
        Task<ActionResult<IEnumerable<HarvestDto>>> GetAll();
        Task<ActionResult<HarvestDto>> GetById(int id);
        Task<IActionResult> Add(HarvestDto harvestDto);
        Task<IActionResult> Update(HarvestDto harvestDto);
        Task<IActionResult> Delete(int id);
    }
}
