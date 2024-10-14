using Entity.DTO.Operational;
using Microsoft.AspNetCore.Mvc;
using Service.Operational.Implements;
using Service.Operational.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Web.Controller.Implements
{
    [ApiController]
    [Route("api/[controller]")]
    public class LiquidationController : ControllerBase
    {
        private readonly ILiquidationService _liquidationService;

        public LiquidationController(ILiquidationService liquidationService)
        {
            _liquidationService = liquidationService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LiquidationDto>>> GetAll()
        {
            var liquidations = await _liquidationService.GetAll();
            return Ok(liquidations);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<LiquidationDto>> GetById(int id)
        {
            var liquidation = await _liquidationService.GetById(id);
            if (liquidation == null)
            {
                return NotFound();
            }
            return Ok(liquidation);
        }

        [HttpPost]
        public async Task<IActionResult> Add(LiquidationDto liquidationDto)
        {
            await _liquidationService.Add(liquidationDto);
            return CreatedAtAction(nameof(GetById), new { id = liquidationDto.Id }, liquidationDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(LiquidationDto liquidationDto)
        {
            await _liquidationService.Update(liquidationDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _liquidationService.Delete(id);
            return NoContent();
        }

        [HttpGet("person/{personId}")]
        public async Task<IActionResult> GetLiquidationsByPersonId(int personId)
        {
            var liquidations = await _liquidationService.GetLiquidationsByPersonIdAsync(personId);
            return Ok(liquidations);
        }

        [HttpGet("farm/{farmId}")]
        public async Task<IActionResult> GetLiquidationsByFarmId(int farmId)
        {
            try
            {
                var liquidations = await _liquidationService.GetLiquidationsByFarmIdAsync(farmId);
                return Ok(liquidations);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
