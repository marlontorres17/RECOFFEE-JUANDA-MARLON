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
    public class ViewRepository : IViewRepository
    {
        private readonly ApplicationDbContext _context;

        public ViewRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<View>> GetAll()
        {
            return await _context.views.ToListAsync();
        }

        public async Task<View> GetById(int id)
        {
            return await _context.views.FindAsync(id);
        }

        public async Task Add(View view)
        {
            await _context.views.AddAsync(view);
            await _context.SaveChangesAsync();
        }

        public async Task Update(View view)
        {
            _context.views.Update(view);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(int id)
        {
            var view = await _context.views.FindAsync(id);
            if (view != null)
            {
                _context.views.Remove(view);
                await _context.SaveChangesAsync();
            }
        }
    }
}
