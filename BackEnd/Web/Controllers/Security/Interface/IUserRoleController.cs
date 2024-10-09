using Entity.DTO.Security;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers.Security.Interface
{
    public interface IUserRoleController
    {
        Task<ActionResult<IEnumerable<UserRoleDto>>> GetAll();
        Task<ActionResult<UserRoleDto>> GetById(int id);
        Task<IActionResult> Add(UserRoleDto userRoleDto);
        Task<IActionResult> Update(UserRoleDto userRoleDto);
        Task<IActionResult> Delete(int id);
    }
}
