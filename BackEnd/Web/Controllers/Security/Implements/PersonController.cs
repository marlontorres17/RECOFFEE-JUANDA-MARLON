using Entity.DTO.Security;
using Microsoft.AspNetCore.Mvc;


using Web.Controllers.Security.Interface;
using Service.Security.Interface;

namespace Web.Controller.Implements
{
    [ApiController]
    [Route("api/[controller]")]
    public class PersonController : ControllerBase, IPersonController
    {
        private readonly IPersonService _personService;


        public PersonController(IPersonService personService)
        {
            _personService = personService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PersonDto>>> GetAll()
        {
            var persons = await _personService.GetAll();
            return Ok(persons);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PersonDto>> GetById(int id)
        {
            var person = await _personService.GetById(id);
            if (person == null)
            {
                return NotFound();
            }
            return Ok(person);
        }

        [HttpPost]
        public async Task<IActionResult> Add(PersonDto personDto)
        {
            await _personService.Add(personDto);
            return CreatedAtAction(nameof(GetById), new { id = personDto.Id }, personDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(PersonDto personDto)
        {
            await _personService.Update(personDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _personService.Delete(id);
            return NoContent();
        }

        [HttpGet("admins")]
        public async Task<IActionResult> GetAdminPersons()
        {
            var adminPersons = await _personService.GetAdmins();
            return Ok(adminPersons);
        }

    }
}
