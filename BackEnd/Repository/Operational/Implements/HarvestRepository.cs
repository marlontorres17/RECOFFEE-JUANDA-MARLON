using Entity.Model.Context;
using Entity.Model.Operational;
using Microsoft.EntityFrameworkCore;
using Repository.Operational.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Repository.Operational.Implements
{
    public class HarvestRepository : IHarvestRepository
    {
        private readonly ApplicationDbContext _context;

        public HarvestRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Harvest>> GetAll()
        {
            return await _context.harvests.ToListAsync();
        }

        public async Task<Harvest> GetById(int id)
        {
            return await _context.harvests.FindAsync(id);
        }

        public async Task Add(Harvest harvest)
        {
            await _context.harvests.AddAsync(harvest);
            await _context.SaveChangesAsync();
        }

        public async Task Update(Harvest harvest)
        {
            _context.harvests.Update(harvest);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(int id)
        {
            var harvest = await _context.harvests.FindAsync(id);
            if (harvest != null)
            {
                _context.harvests.Remove(harvest);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<Harvest>> GetHarvestsByFarmIdAsync(int farmId)
        {
            return await _context.Set<Harvest>()
                .Include(h => h.Lot)
                .Where(h => h.Lot.FarmId == farmId)
                .ToListAsync();
        }
    }
}
