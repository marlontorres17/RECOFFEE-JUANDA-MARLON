using Entity.DTO.Security;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers.Security.Interface
{
    public interface IUserController
    {
        Task<ActionResult<IEnumerable<UserDto>>> GetAll();
        Task<ActionResult<UserDto>> GetById(int id);
        Task<IActionResult> Add(UserDto userDto);
        Task<IActionResult> Update(UserDto userDto);
        Task<IActionResult> Delete(int id);

    }
}
