using Entity.DTO.Security;
using Microsoft.AspNetCore.Mvc;


using Web.Controllers.Security.Interface;
using Service.Security.Interface;

namespace Web.Controller.Implements
{
    [ApiController]
    [Route("api/[controller]")]
    public class ViewController : ControllerBase, IViewController
    {
        private readonly IViewService _viewService;

        public ViewController(IViewService viewService)
        {
            _viewService = viewService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ViewDto>>> GetAll()
        {
            var views = await _viewService.GetAll();
            return Ok(views);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ViewDto>> GetById(int id)
        {
            var view = await _viewService.GetById(id);
            if (view == null)
            {
                return NotFound();
            }
            return Ok(view);
        }

        [HttpPost]
        public async Task<IActionResult> Add(ViewDto viewDto)
        {
            await _viewService.Add(viewDto);
            return CreatedAtAction(nameof(GetById), new { id = viewDto.Id }, viewDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(ViewDto viewDto)
        {
            await _viewService.Update(viewDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _viewService.Delete(id);
            return NoContent();
        }
    }
}
