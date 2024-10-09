using Entity.DTO.Parameter;
using Microsoft.AspNetCore.Mvc;


using Web.Controllers.Parameter.Interface;
using Service.Parameter.Interface;

namespace Web.Controller.Implements
{
    [ApiController]
    [Route("api/[controller]")]
    public class CityController : ControllerBase, ICityController
    {
        private readonly ICityService _cityService;


        public CityController(ICityService cityService)
        {
            _cityService = cityService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CityDto>>> GetAll()
        {
            var citys = await _cityService.GetAll();
            return Ok(citys);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CityDto>> GetById(int id)
        {
            var city = await _cityService.GetById(id);
            if (city == null)
            {
                return NotFound();
            }
            return Ok(city);
        }

        [HttpPost]
        public async Task<IActionResult> Add(CityDto cityDto)
        {
            await _cityService.Add(cityDto);
            return CreatedAtAction(nameof(GetById), new { id = cityDto.Id }, cityDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(CityDto cityDto)
        {
            await _cityService.Update(cityDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _cityService.Delete(id);
            return NoContent();
        }
    }
}
