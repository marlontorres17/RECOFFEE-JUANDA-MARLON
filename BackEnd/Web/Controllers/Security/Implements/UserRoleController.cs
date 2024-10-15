using Entity.DTO.Security;
using Microsoft.AspNetCore.Mvc;


using Web.Controllers.Security.Interface;
using Service.Security.Interface;

namespace Web.Controller.Implements
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserRoleController : ControllerBase, IUserRoleController
    {
        private readonly IUserRoleService _userRoleService;


        public UserRoleController(IUserRoleService userRoleService)
        {
            _userRoleService = userRoleService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserRoleDto>>> GetAll()
        {
            var userRoles = await _userRoleService.GetAll();
            return Ok(userRoles);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserRoleDto>> GetById(int id)
        {
            var userRole = await _userRoleService.GetById(id);
            if (userRole == null)
            {
                return NotFound();
            }
            return Ok(userRole);
        }

        [HttpPost]
        public async Task<IActionResult> Add(UserRoleDto userRoleDto)
        {
            await _userRoleService.Add(userRoleDto);
            return CreatedAtAction(nameof(GetById), new { id = userRoleDto.Id }, userRoleDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(UserRoleDto userRoleDto)
        {
            await _userRoleService.Update(userRoleDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _userRoleService.Delete(id);
            return NoContent();
        }
    }
}
