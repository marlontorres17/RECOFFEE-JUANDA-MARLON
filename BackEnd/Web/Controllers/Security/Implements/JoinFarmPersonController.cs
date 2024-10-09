using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using Entity.Model.Operational;
using Entity.DTO.Operational;
using Service.Operational.Implements; 
using Repository.Operational.Interface;
using Service.Parameter.Implements;
using Repository.Parameter.Interface;
using Service.Security.Implements; 
using Repository.Security.Interface; 

namespace YourNamespace.Controllers 
{
    [Route("api/[controller]")]
    [ApiController]
    public class JoinFarmPersonController : ControllerBase
    {
        private readonly IPersonRepository _personRepository;
        private readonly IFarmRepository _farmRepository;
        private readonly ICollectorFarmRepository _collectorFarmRepository;

        public JoinFarmPersonController(
            IPersonRepository personRepository,
            IFarmRepository farmRepository,
            ICollectorFarmRepository collectorFarmRepository)
        {
            _personRepository = personRepository;
            _farmRepository = farmRepository;
            _collectorFarmRepository = collectorFarmRepository;
        }

        [HttpPost("join")]
        public IActionResult JoinFarm([FromBody] JoinFarmRequest request)
        {
            // Validar entrada
            if (string.IsNullOrEmpty(request.IdentificationNumber) || string.IsNullOrEmpty(request.CodigoUnico))
            {
                return BadRequest("Número de identificación y código de finca son requeridos.");
            }

            // Buscar la persona por número de identificación
            var person = _personRepository.GetByIdentificationNumber(request.IdentificationNumber);
            if (person == null)
            {
                return BadRequest("Número de identificación no encontrado.");
            }

            // Buscar la finca por código único
            var farm = _farmRepository.GetByCodigoUnico(request.CodigoUnico);
            if (farm == null || !farm.State)
            {
                return BadRequest("Código de finca incorrecto o finca inactiva.");
            }

            // Verificar si ya está unido a la finca
            var existingEntry = _collectorFarmRepository.GetByPersonAndFarm(person.Id, farm.Id);
            if (existingEntry != null)
            {
                return BadRequest("Ya estás unido a esta finca.");
            }

            // Crear el registro de unión
            var collectorFarm = new CollectorFarm
            {
                FarmId = farm.Id,
                PersonId = person.Id,
                DateStart = DateTime.UtcNow
            };

            // Guardar en la base de datos
            _collectorFarmRepository.Add(collectorFarm);
            return Ok("Te has unido a la finca exitosamente.");
        }
    }

    // DTO para la solicitud
    public class JoinFarmRequest
    {
        public string IdentificationNumber { get; set; }
        public string CodigoUnico { get; set; }
    }
}
