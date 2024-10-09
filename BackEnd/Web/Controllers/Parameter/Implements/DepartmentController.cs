using Entity.DTO.Parameter;
using Microsoft.AspNetCore.Mvc;


using Web.Controllers.Parameter.Interface;
using Service.Parameter.Interface;

namespace Web.Controller.Implements
{
    [ApiController]
    [Route("api/[controller]")]
    public class DepartmentController : ControllerBase, IDepartmentController
    {
        private readonly IDepartmentService _departmentService;


        public DepartmentController(IDepartmentService departmentService)
        {
            _departmentService = departmentService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DepartmentDto>>> GetAll()
        {
            var departments = await _departmentService.GetAll();
            return Ok(departments);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DepartmentDto>> GetById(int id)
        {
            var department = await _departmentService.GetById(id);
            if (department == null)
            {
                return NotFound();
            }
            return Ok(department);
        }

        [HttpPost]
        public async Task<IActionResult> Add(DepartmentDto departmentDto)
        {
            await _departmentService.Add(departmentDto);
            return CreatedAtAction(nameof(GetById), new { id = departmentDto.Id }, departmentDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(DepartmentDto departmentDto)
        {
            await _departmentService.Update(departmentDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _departmentService.Delete(id);
            return NoContent();
        }
    }
}
