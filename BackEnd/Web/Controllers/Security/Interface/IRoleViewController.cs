using Entity.DTO.Security;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers.Security.Interface
{
    public interface IRoleViewController
    {
        Task<ActionResult<IEnumerable<RoleViewDto>>> GetAll();
        Task<ActionResult<RoleViewDto>> GetById(int id);
        Task<IActionResult> Add(RoleViewDto roleViewDto);
        Task<IActionResult> Update(RoleViewDto roleViewDto);
        Task<IActionResult> Delete(int id);
    }
}

