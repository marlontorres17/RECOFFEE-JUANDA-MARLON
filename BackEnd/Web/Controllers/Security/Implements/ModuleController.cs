using Entity.DTO.Security;
using Microsoft.AspNetCore.Mvc;


using Web.Controllers.Security.Interface;
using Service.Security.Interface;

namespace Web.Controller.Implements
{
    [ApiController]
    [Route("api/[controller]")]
    public class ModuleController : ControllerBase, IModuleController
    {
        private readonly IModuleService _moduleService;


        public ModuleController(IModuleService moduleService)
        {
            _moduleService = moduleService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ModuleDto>>> GetAll()
        {
            var modules = await _moduleService.GetAll();
            return Ok(modules);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ModuleDto>> GetById(int id)
        {
            var module = await _moduleService.GetById(id);
            if (module == null)
            {
                return NotFound();
            }
            return Ok(module);
        }

        [HttpPost]
        public async Task<IActionResult> Add(ModuleDto moduleDto)
        {
            await _moduleService.Add(moduleDto);
            return CreatedAtAction(nameof(GetById), new { id = moduleDto.Id }, moduleDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(ModuleDto moduleDto)
        {
            await _moduleService.Update(moduleDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _moduleService.Delete(id);
            return NoContent();
        }
    }
}
