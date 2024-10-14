using Entity.Model.Context;
using Entity.Model.Operational;
using Microsoft.EntityFrameworkCore;
using Repository.Operational.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Repository.Operational.Implements
{
    public class BenefitRepository : IBenefitRepository
    {
        private readonly ApplicationDbContext _context;

        public BenefitRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Benefit>> GetAll()
        {
            return await _context.benefits.ToListAsync();
        }

        public async Task<Benefit> GetById(int id)
        {
            return await _context.benefits.FindAsync(id);
        }

        public async Task Add(Benefit benefit)
        {
            await _context.benefits.AddAsync(benefit);
            await _context.SaveChangesAsync();
        }

        public async Task Update(Benefit benefit)
        {
            _context.benefits.Update(benefit);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(int id)
        {
            var benefit = await _context.benefits.FindAsync(id);
            if (benefit != null)
            {
                _context.benefits.Remove(benefit);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<Benefit>> GetBenefitsByFarmIdAsync(int farmId)
        {
            return await _context.Set<Benefit>()
                .Where(b => b.FarmId == farmId)
                .ToListAsync();
        }
    }
}
