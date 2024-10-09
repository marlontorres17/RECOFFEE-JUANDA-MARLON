using Entity.Model.Context;
using Entity.Model.Operational;
using Microsoft.EntityFrameworkCore;
using Repository.Operational.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;
using Entity.Model.Operational;
using Repository.Operational.Interface;
using Dapper;
using Entity.DTO.Operational;


namespace Repository.Operational.Implements
{
    public class CollectorFarmRepository : ICollectorFarmRepository
    {
        private readonly ApplicationDbContext _context;

        public CollectorFarmRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CollectorFarm>> GetAll()
        {
            return await _context.collectorFarms.ToListAsync();
        }

        public async Task<CollectorFarm> GetById(int id)
        {
            return await _context.collectorFarms.FindAsync(id);
        }

        

        public async Task Update(CollectorFarm collectorFarm)
        {
            _context.collectorFarms.Update(collectorFarm);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(int id)
        {
            var collectorFarm = await _context.collectorFarms.FindAsync(id);
            if (collectorFarm != null)
            {
                _context.collectorFarms.Remove(collectorFarm);
                await _context.SaveChangesAsync();
            }
        }

        public CollectorFarm GetByPersonAndFarm(int personId, int farmId)
        {
            return _context.collectorFarms
                .FirstOrDefault(cf => cf.PersonId == personId && cf.FarmId == farmId);
        }

        public async Task Add(CollectorFarm collectorFarm)
        {
            _context.collectorFarms.Add(collectorFarm);
            _context.SaveChanges(); // Guarda los cambios en la base de datos
        }

        public async Task<IEnumerable<CollectorDto>> GetCollectorsByFarmCode(string farmCode)
        {
            string query = @"
                SELECT p.FirstName, p.SecondName, p.FirstLastName, p.Gender, p.DateOfBirth, p.NumberDocument, cf.DateStart
                FROM collectorFarms cf
                JOIN persons p ON cf.PersonId = p.Id
                JOIN farms f ON cf.FarmId = f.Id
                WHERE cf.FarmId = (SELECT Id FROM farms WHERE codeUnique = @FarmCode);
            ";

            var parameters = new { FarmCode = farmCode };

            using var connection = _context.Database.GetDbConnection();
            return await connection.QueryAsync<CollectorDto>(query, parameters);
        }

        public async Task<Farm> GetFarmByPersonIdAsync(int personId)
        {
            return await _context.collectorFarms
        .Where(fp => fp.PersonId == personId)
        .Select(fp => fp.Farm) // Selecciona la finca a la que está asociada la persona
        .FirstOrDefaultAsync();
        }


    }
}
