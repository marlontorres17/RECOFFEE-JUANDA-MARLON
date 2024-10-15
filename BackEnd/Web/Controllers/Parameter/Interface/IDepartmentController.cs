using Entity.DTO.Parameter;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers.Parameter.Interface
{
    public interface IDepartmentController
    {
        Task<ActionResult<IEnumerable<DepartmentDto>>> GetAll();
        Task<ActionResult<DepartmentDto>> GetById(int id);
        Task<IActionResult> Add(DepartmentDto departmentDto);
        Task<IActionResult> Update(DepartmentDto departmentDto);
        Task<IActionResult> Delete(int id);
    }
}
