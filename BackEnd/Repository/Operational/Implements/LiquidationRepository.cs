using Entity.DTO.Operational;
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






    }
}
