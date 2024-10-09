using Entity.DTO.Operational;
using Microsoft.AspNetCore.Mvc;
using Service.Operational.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;
using Web.Controllers.Operational.Interface;

namespace Web.Controllers.Operational.Implements
{
    [ApiController]
    [Route("api/[controller]")]
    public class FarmController : ControllerBase, IFarmController
    {
        private readonly IFarmService _farmService;

        public FarmController(IFarmService farmService)
        {
            _farmService = farmService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FarmDto>>> GetAll()
        {
            var farms = await _farmService.GetAll();
            return Ok(farms);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FarmDto>> GetById(int id)
        {
            var farm = await _farmService.GetById(id);
            if (farm == null)
            {
                return NotFound();
            }
            return Ok(farm);
        }

        [HttpPost]
        public async Task<IActionResult> Add(FarmDto farmDto)
        {
            await _farmService.Add(farmDto);
            return CreatedAtAction(nameof(GetById), new { id = farmDto.Id }, farmDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(FarmDto farmDto)
        {
            await _farmService.Update(farmDto);
            return NoContent();
        }

        [HttpGet("person/{personId}")]
        public async Task<IActionResult> GetFarmByPersonId(int personId)
        {
            var farm = await _farmService.GetFarmByPersonIdAsync(personId);
            if (farm == null)
            {
                return NotFound();
            }

            return Ok(farm);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _farmService.Delete(id);
            return NoContent();
        }
            
    }
}
