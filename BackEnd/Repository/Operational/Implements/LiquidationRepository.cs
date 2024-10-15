using Entity.DTO;
using Entity.DTO.Operational;
using Entity.DTO.Security;
using Entity.Model.Context;
using Entity.Model.Operational;
using Entity.Model.Security;
using Microsoft.EntityFrameworkCore;
using Repository.Operational.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Repository.Operational.Implements
{
    public class LiquidationRepository : ILiquidationRepository
    {
        private readonly ApplicationDbContext _context;

        public LiquidationRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Liquidation>> GetAll()
        {
            return await _context.liquidations.ToListAsync();
        }

        public async Task<Liquidation> GetById(int id)
        {
            return await _context.liquidations.FindAsync(id);
        }

        public async Task Add(Liquidation liquidation)
        {
            await _context.liquidations.AddAsync(liquidation);
            await _context.SaveChangesAsync();
        }

        public async Task Update(Liquidation liquidation)
        {
            _context.liquidations.Update(liquidation);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(int id)
        {
            var liquidation = await _context.liquidations.FindAsync(id);
            if (liquidation != null)
            {
                _context.liquidations.Remove(liquidation);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<Liquidation>> GetLiquidationsByPersonIdAsync(int personId)
        {
            return await _context.Set<Liquidation>()
                .Where(l => l.PersonId == personId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Liquidation>> GetLiquidationsByFarmIdAsync(int farmId)
        {
            var liquidations = await _context.Set<Liquidation>()
                .Where(l => l.FarmId == farmId) // Filtra las liquidaciones por FarmId
                .ToListAsync();

            if (liquidations == null || !liquidations.Any())
            {
                throw new Exception("No se encontraron liquidaciones para esta finca.");
            }

            return liquidations;
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
