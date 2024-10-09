using Entity.DTO.Security;
using Microsoft.AspNetCore.Mvc;


using Web.Controllers.Security.Interface;
using Service.Security.Interface;

namespace Web.Controller.Implements
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoleViewController : ControllerBase, IRoleViewController
    {
        private readonly IRoleViewService _roleViewService;

        public RoleViewController(IRoleViewService roleViewService)
        {
            _roleViewService = roleViewService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoleViewDto>>> GetAll()
        {
            var roleViews = await _roleViewService.GetAll();
            return Ok(roleViews);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RoleViewDto>> GetById(int id)
        {
            var roleView = await _roleViewService.GetById(id);
            if (roleView == null)
            {
                return NotFound();
            }
            return Ok(roleView);
        }

        [HttpPost]
        public async Task<IActionResult> Add(RoleViewDto roleViewDto)
        {
            await _roleViewService.Add(roleViewDto);
            return CreatedAtAction(nameof(GetById), new { id = roleViewDto.Id }, roleViewDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(RoleViewDto roleViewDto)
        {
            await _roleViewService.Update(roleViewDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _roleViewService.Delete(id);
            return NoContent();
        }
    }
}
