using Entity.Model.Context;
using Entity.Model.Parameter;
using Microsoft.EntityFrameworkCore;
using Repository.Parameter.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Parameter.Implements
{
    public class CountryRepository : ICountryRepository
    {
        private readonly ApplicationDbContext _context;

        public CountryRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Country>> GetAll()
        {
            return await _context.countries.ToListAsync();
        }

        public async Task<Country> GetById(int id)
        {
            return await _context.countries.FindAsync(id);
        }

        public async Task Add(Country country)
        {
            await _context.countries.AddAsync(country);
            await _context.SaveChangesAsync();
        }

        public async Task Update(Country country)
        {
            _context.countries.Update(country);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(int id)
        {
            var country = await _context.countries.FindAsync(id);
            if (country != null)
            {
                _context.countries.Remove(country);
                await _context.SaveChangesAsync();
            }
        }
    }
}
