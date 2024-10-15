using Entity.DTO.Operational;
using Microsoft.AspNetCore.Mvc;
using Service.Operational.Implements;
using Service.Operational.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;
using Web.Controllers.Operational.Interface;

namespace Web.Controllers.Operational.Implements
{
    [ApiController]
    [Route("api/[controller]")]
    public class CollectorFarmController : ControllerBase, ICollectorFarmController
    {
        private readonly ICollectorFarmService _collectorFarmService;

       
        public CollectorFarmController(ICollectorFarmService collectorFarmService)
        {
            _collectorFarmService = collectorFarmService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CollectorFarmDto>>> GetAll()
        {
            var collectorFarms = await _collectorFarmService.GetAll();
            return Ok(collectorFarms);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CollectorFarmDto>> GetById(int id)
        {
            var collectorFarm = await _collectorFarmService.GetById(id);
            if (collectorFarm == null)
            {
                return NotFound();
            }
            return Ok(collectorFarm);
        }

        [HttpPost]
        public async Task<IActionResult> Add(CollectorFarmDto collectorFarmDto)
        {
            await _collectorFarmService.Add(collectorFarmDto);
            return CreatedAtAction(nameof(GetById), new { id = collectorFarmDto.Id }, collectorFarmDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(CollectorFarmDto collectorFarmDto)
        {
            await _collectorFarmService.Update(collectorFarmDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _collectorFarmService.Delete(id);
            return NoContent();
        }

        [HttpGet("collectorsByFarmCode/{farmCode}")]
        public async Task<ActionResult<IEnumerable<CollectorDto>>> GetCollectorsByFarmCode(string farmCode)
        {
            var collectors = await _collectorFarmService.GetCollectorsByFarmCode(farmCode);
            if (collectors == null || !collectors.Any()) 
            {
                return NotFound();
            }
            return Ok(collectors);
        }

        [HttpGet("person/{personId}")]
        public async Task<IActionResult> GetFarmByPersonId(int personId)
        {
            // Llama al servicio para obtener la finca asociada a la persona
            var farm = await _collectorFarmService.GetFarmByPersonIdAsync(personId);

            if (farm == null)
            {
                // Retorna 404 si no se encontró la finca
                return NotFound();
            }

            // Si se encontró la finca, retorna 200 con la información de la finca
            return Ok(farm);
        }

        [HttpGet("person/farm/{personId}")]
        public async Task<IActionResult> GetCollectorFarmsByPersonId(int personId)
        {
            var collectorFarms = await _collectorFarmService.GetCollectorFarmsByPersonIdAsync(personId);
            return Ok(collectorFarms);
        }

        [HttpGet("farm/person/{personId}")]
        public async Task<IActionResult> GetFarmByPersonIdU(int personId)
        {
            var collectorFarm = await _collectorFarmService.GetFarmByPersonIdAsync(personId);

            if (collectorFarm == null)
            {
                return NotFound("No se encontró la finca asociada a la persona.");
            }

            return Ok(collectorFarm);
        }

    }
}
