using Entity.DTO.Security;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers.Security.Interface
{
    public interface IRoleController
    {
        Task<ActionResult<IEnumerable<RoleDto>>> GetAll();
        Task<ActionResult<RoleDto>> GetById(int id);
        Task<IActionResult> Add(RoleDto roleDto);
        Task<IActionResult> Update(RoleDto roleDto);
        Task<IActionResult> Delete(int id);
    }
}
