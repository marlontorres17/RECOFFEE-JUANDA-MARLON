using Entity.DTO.Operational;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Web.Controllers.Operational.Interface
{
    public interface IBenefitController
    {
        Task<ActionResult<IEnumerable<BenefitDto>>> GetAll();
        Task<ActionResult<BenefitDto>> GetById(int id);
        Task<IActionResult> Add(BenefitDto benefitDto);
        Task<IActionResult> Update(BenefitDto benefitDto);
        Task<IActionResult> Delete(int id);
    }
}
