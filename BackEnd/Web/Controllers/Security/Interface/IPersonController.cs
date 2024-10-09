using Entity.DTO.Security;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers.Security.Interface
{
    public interface IPersonController
    {
        Task<ActionResult<IEnumerable<PersonDto>>> GetAll();
        Task<ActionResult<PersonDto>> GetById(int id);
        Task<IActionResult> Add(PersonDto personDto);
        Task<IActionResult> Update(PersonDto personDto);
        Task<IActionResult> Delete(int id);
        Task<IActionResult> GetAdminPersons();
    }
}
