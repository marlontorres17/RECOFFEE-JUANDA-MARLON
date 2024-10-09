using Entity.Model.Context;
using Entity.Model.Security;
using Microsoft.EntityFrameworkCore;
using Repository.Security.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Security.Implements
{
    public class ModuleRepository : IModuleRepository
    {
        private readonly ApplicationDbContext _context;

        public ModuleRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Module>> GetAll()
        {
            return await _context.modules.ToListAsync();
        }

        public async Task<Module> GetById(int id)
        {
            return await _context.modules.FindAsync(id);
        }

        public async Task Add(Module module)
        {
            await _context.modules.AddAsync(module);
            await _context.SaveChangesAsync();
        }

        public async Task Update(Module module)
        {
            _context.modules.Update(module);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(int id)
        {
            var module = await _context.modules.FindAsync(id);
            if (module != null)
            {
                _context.modules.Remove(module);
                await _context.SaveChangesAsync();
            }
        }
    }
}
