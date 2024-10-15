using Entity.DTO.Operational;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Web.Controllers.Operational.Interface
{
    public interface IPersonBenefitController
    {
        Task<ActionResult<IEnumerable<PersonBenefitDto>>> GetAll();
        Task<ActionResult<PersonBenefitDto>> GetById(int id);
        Task<IActionResult> Add(PersonBenefitDto personBenefitDto);
        Task<IActionResult> Update(PersonBenefitDto personBenefitDto);
        Task<IActionResult> Delete(int id);
    }
}
