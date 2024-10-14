using Entity.DTO;
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
    public class PersonBenefitController : ControllerBase, IPersonBenefitController
    {
        private readonly IPersonBenefitService _personBenefitService;

        public PersonBenefitController(IPersonBenefitService personBenefitService)
        {
            _personBenefitService = personBenefitService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PersonBenefitDto>>> GetAll()
        {
            var personBenefits = await _personBenefitService.GetAll();
            return Ok(personBenefits);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PersonBenefitDto>> GetById(int id)
        {
            var personBenefit = await _personBenefitService.GetById(id);
            if (personBenefit == null)
            {
                return NotFound();
            }
            return Ok(personBenefit);
        }

        [HttpPost]
        public async Task<IActionResult> Add(PersonBenefitDto personBenefitDto)
        {
            await _personBenefitService.Add(personBenefitDto);
            return CreatedAtAction(nameof(GetById), new { id = personBenefitDto.Id }, personBenefitDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(PersonBenefitDto personBenefitDto)
        {
            await _personBenefitService.Update(personBenefitDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _personBenefitService.Delete(id);
            return NoContent();
        }
        [HttpGet("person/{personId}")]
        public async Task<IActionResult> GetPersonBenefitsByPersonId(int personId)
        {
            var personBenefits = await _personBenefitService.GetPersonBenefitsByPersonIdAsync(personId);
            return Ok(personBenefits);
        }

        [HttpGet("farm/{farmId}")]
        public async Task<ActionResult<IEnumerable<UserPersonRoleDto>>> GetCollectorsByFarmId(int farmId)
        {
            if (farmId <= 0)
            {
                return BadRequest("El ID de la finca debe ser mayor que cero.");
            }

            var collectors = await _personBenefitService.GetCollectorsPersonsByFarmIdAsync(farmId);

            if (collectors == null || !collectors.Any())
            {
                return NotFound("No se encontraron recolectores para esta finca.");
            }

            return Ok(collectors);
        }

    }
}
