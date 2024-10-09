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
    public class CityRepository : ICityRepository
    {
        private readonly ApplicationDbContext _context;

        public CityRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<City>> GetAll()
        {
            return await _context.cities.ToListAsync();
        }

        public async Task<City> GetById(int id)
        {
            return await _context.cities.FindAsync(id);
        }

        public async Task Add(City city)
        {
            await _context.cities.AddAsync(city);
            await _context.SaveChangesAsync();
        }

        public async Task Update(City city)
        {
            _context.cities.Update(city);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(int id)
        {
            var city = await _context.cities.FindAsync(id);
            if (city != null)
            {
                _context.cities.Remove(city);
                await _context.SaveChangesAsync();
            }
        }
    }
}
