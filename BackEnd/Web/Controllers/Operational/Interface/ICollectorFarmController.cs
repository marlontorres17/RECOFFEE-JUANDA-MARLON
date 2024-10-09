using Entity.DTO.Operational;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers.Operational.Interface
{
    public interface ICollectorFarmController
    {
        Task<ActionResult<IEnumerable<CollectorFarmDto>>> GetAll();
        Task<ActionResult<CollectorFarmDto>> GetById(int id);
        Task<IActionResult> Add(CollectorFarmDto collectorFarmDto);
        Task<IActionResult> Update(CollectorFarmDto collectorFarmDto);
        Task<IActionResult> Delete(int id);
    }
}
