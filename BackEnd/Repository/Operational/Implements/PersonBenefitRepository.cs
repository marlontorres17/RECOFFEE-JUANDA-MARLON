using Entity.DTO.Security;
using Entity.DTO;
using Entity.Model.Context;
using Entity.Model.Operational;
using Microsoft.EntityFrameworkCore;
using Repository.Operational.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Repository.Operational.Implements
{
    public class PersonBenefitRepository : IPersonBenefitRepository
    {
        private readonly ApplicationDbContext _context;

        public PersonBenefitRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<PersonBenefit>> GetAll()
        {
            return await _context.personBenefits.ToListAsync();
        }

        public async Task<PersonBenefit> GetById(int id)
        {
            return await _context.personBenefits.FindAsync(id);
        }

        public async Task Add(PersonBenefit personBenefit)
        {
            await _context.personBenefits.AddAsync(personBenefit);
            await _context.SaveChangesAsync();
        }

        public async Task Update(PersonBenefit personBenefit)
        {
            _context.personBenefits.Update(personBenefit);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(int id)
        {
            var personBenefit = await _context.personBenefits.FindAsync(id);
            if (personBenefit != null)
            {
                _context.personBenefits.Remove(personBenefit);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<PersonBenefit>> GetPersonBenefitsByPersonIdAsync(int personId)
        {
            // Obtener beneficios de una persona con el rol de recolector
            int collectorRoleId = 2; // Cambia este ID al rol de recolector en tu base de datos

            return await _context.personBenefits
                .Include(pb => pb.Benefit) // Incluir los detalles del beneficio
                .Where(pb => pb.PersonId == personId &&
                             _context.userRoles.Any(ur => ur.UserId == pb.PersonId && ur.RoleId == collectorRoleId))
                .ToListAsync();
        }

        public async Task<IEnumerable<UserPersonRoleDto>> GetCollectorsPersonsByFarmIdAsync(int farmId)
        {
            // Asegúrate de usar el ID correcto para el rol de recolector
            int collectorRoleId = 2; // Cambia esto al ID real del rol de recolector

            return await _context.users
                .Include(u => u.Person) // Incluye la entidad Person
                .Join(_context.userRoles,
                      u => u.Id,
                      ur => ur.UserId,
                      (u, ur) => new { u, ur })
                .Join(_context.collectorFarms, // Usa la tabla CollectorFarm para obtener la relación entre persona y finca
                      u_ur => u_ur.u.Person.Id,
                      cf => cf.PersonId,
                      (u_ur, cf) => new { u_ur.u, u_ur.ur, cf })
                .Where(x => x.ur.RoleId == collectorRoleId && x.cf.FarmId == farmId) // Filtra por el farmId
                .Select(x => new UserPersonRoleDto
                {
                    User = new UserDto
                    {
                        Id = x.u.Id,
                        UserName = x.u.UserName,
                        PersonId = x.u.PersonId
                    },
                    Person = new PersonDto
                    {
                        Id = x.u.Person.Id,
                        FirstName = x.u.Person.FirstName,
                        SecondName = x.u.Person.SecondName,
                        FirstLastName = x.u.Person.FirstLastName,
                        SecondLastName = x.u.Person.SecondLastName,
                        Email = x.u.Person.Email,
                        DateOfBirth = x.u.Person.DateOfBirth,
                        Gender = x.u.Person.Gender,
                        CityId = x.u.Person.CityId,
                        TypeDocument = x.u.Person.TypeDocument,
                        NumberDocument = x.u.Person.NumberDocument
                    },
                    RoleName = x.ur.Role.Name
                })
                .ToListAsync();
        }



    }
}
