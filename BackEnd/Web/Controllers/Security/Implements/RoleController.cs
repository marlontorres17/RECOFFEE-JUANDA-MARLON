using Entity.DTO.Security;
using Microsoft.AspNetCore.Mvc;


using Web.Controllers.Security.Interface;
using Service.Security.Interface;

namespace Web.Controller.Implements
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoleController : ControllerBase, IRoleController
    {
        private readonly IRoleService _roleService;


        public RoleController(IRoleService roleService)
        {
            _roleService = roleService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoleDto>>> GetAll()
        {
            var roles = await _roleService.GetAll();
            return Ok(roles);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RoleDto>> GetById(int id)
        {
            var role = await _roleService.GetById(id);
            if (role == null)
            {
                return NotFound();
            }
            return Ok(role);
        }

        [HttpPost]
        public async Task<IActionResult> Add(RoleDto roleDto)
        {
            await _roleService.Add(roleDto);
            return CreatedAtAction(nameof(GetById), new { id = roleDto.Id }, roleDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(RoleDto roleDto)
        {
            await _roleService.Update(roleDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _roleService.Delete(id);
            return NoContent();
        }
    }
}
