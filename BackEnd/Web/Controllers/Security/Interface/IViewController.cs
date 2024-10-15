using Entity.DTO.Security;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers.Security.Interface
{
    public interface IViewController
    {
        Task<ActionResult<IEnumerable<ViewDto>>> GetAll();
        Task<ActionResult<ViewDto>> GetById(int id);
        Task<IActionResult> Add(ViewDto viewDto);
        Task<IActionResult> Update(ViewDto viewDto);
        Task<IActionResult> Delete(int id);
    }
}
