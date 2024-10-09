using Entity.Model.Context;
using Entity.Model.Operational;
using Microsoft.EntityFrameworkCore;
using Repository.Operational.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;
using Entity.Model.Operational;
using Repository.Operational.Interface;


namespace Repository.Operational.Implements
{
    public class FarmRepository : IFarmRepository
    {
        private readonly ApplicationDbContext _context;

        public FarmRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Farm>> GetAll()
        {
            return await _context.farms.ToListAsync();
        }

        public async Task<Farm> GetById(int id)
        {
            return await _context.farms.FindAsync(id);
        }

        public async Task Add(Farm farm)
        {
            await _context.farms.AddAsync(farm);
            await _context.SaveChangesAsync();
        }

        public async Task Update(Farm farm)
        {
            _context.farms.Update(farm);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(int id)
        {
            var farm = await _context.farms.FindAsync(id);
            if (farm != null)
            {
                _context.farms.Remove(farm);
                await _context.SaveChangesAsync();
            }
        }

        public Farm GetByCodigoUnico(string codigoUnico)
        {
            return _context.farms
                .FirstOrDefault(f => f.codeUnique == codigoUnico && f.State);
        }

        public async Task<Farm> GetFarmByPersonIdAsync(int personId)
        {
            return await _context.farms
                .FirstOrDefaultAsync(f => f.PersonId == personId);
        }


    }
}
