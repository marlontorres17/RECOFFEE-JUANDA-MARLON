using Entity.Model.Context;
using Entity.Model.Operational;
using Microsoft.EntityFrameworkCore;
using Repository.Operational.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Repository.Operational.Implements
{
    public class LotRepository : ILotRepository
    {
        private readonly ApplicationDbContext _context;

        public LotRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Lot>> GetAll()
        {
            return await _context.lots.ToListAsync();
        }

        public async Task<Lot> GetById(int id)
        {
            return await _context.lots.FindAsync(id);
        }

        public async Task Add(Lot lot)
        {
            await _context.lots.AddAsync(lot);
            await _context.SaveChangesAsync();
        }

        public async Task Update(Lot lot)
        {
            _context.lots.Update(lot);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(int id)
        {
            var lot = await _context.lots.FindAsync(id);
            if (lot != null)
            {
                _context.lots.Remove(lot);
                await _context.SaveChangesAsync();
            }
        }
    }
}
