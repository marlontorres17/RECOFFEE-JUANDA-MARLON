using Entity.DTO.Parameter;
using Microsoft.AspNetCore.Mvc;


using Web.Controllers.Parameter.Interface;
using Service.Parameter.Interface;

namespace Web.Controller.Implements
{
    [ApiController]
    [Route("api/[controller]")]
    public class CountryController : ControllerBase, ICountryController
    {
        private readonly ICountryService _countryService;


        public CountryController(ICountryService countryService)
        {
            _countryService = countryService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CountryDto>>> GetAll()
        {
            var countrys = await _countryService.GetAll();
            return Ok(countrys);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CountryDto>> GetById(int id)
        {
            var country = await _countryService.GetById(id);
            if (country == null)
            {
                return NotFound();
            }
            return Ok(country);
        }

        [HttpPost]
        public async Task<IActionResult> Add(CountryDto countryDto)
        {
            await _countryService.Add(countryDto);
            return CreatedAtAction(nameof(GetById), new { id = countryDto.Id }, countryDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(CountryDto countryDto)
        {
            await _countryService.Update(countryDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _countryService.Delete(id);
            return NoContent();
        }
    }
}
