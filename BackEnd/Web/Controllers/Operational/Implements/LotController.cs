using Entity.DTO.Operational;
using Microsoft.AspNetCore.Mvc;
using Service.Operational.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;
using Web.Controllers.Operational.Interface;

namespace Web.Controller.Implements
{
    [ApiController]
    [Route("api/[controller]")]
    public class LotController : ControllerBase, ILotController
    {
        private readonly ILotService _lotService;

        public LotController(ILotService lotService)
        {
            _lotService = lotService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LotDto>>> GetAll()
        {
            var lots = await _lotService.GetAll();
            return Ok(lots);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<LotDto>> GetById(int id)
        {
            var lot = await _lotService.GetById(id);
            if (lot == null)
            {
                return NotFound();
            }
            return Ok(lot);
        }

        [HttpPost]
        public async Task<IActionResult> Add(LotDto lotDto)
        {
            await _lotService.Add(lotDto);
            return CreatedAtAction(nameof(GetById), new { id = lotDto.Id }, lotDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(LotDto lotDto)
        {
            await _lotService.Update(lotDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _lotService.Delete(id);
            return NoContent();
        }

        [HttpGet("farm/{farmId}")]
        public async Task<IActionResult> GetLotsByFarmId(int farmId)
        {
            var lots = await _lotService.GetLotsByFarmIdAsync(farmId);
            return Ok(lots);
        }
    }
}
