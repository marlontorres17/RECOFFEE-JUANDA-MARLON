using Entity.DTO.Security;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers.Security.Interface
{
    public interface IModuleController
    {
        Task<ActionResult<IEnumerable<ModuleDto>>> GetAll();
        Task<ActionResult<ModuleDto>> GetById(int id);
        Task<IActionResult> Add(ModuleDto moduleDto);
        Task<IActionResult> Update(ModuleDto moduleDto);
        Task<IActionResult> Delete(int id);
    }
}
