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
    public class RoleViewRepository : IRoleViewRepository
    {
        private readonly ApplicationDbContext _context;

        public RoleViewRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<RoleView>> GetAll()
        {
            return await _context.roleViews.ToListAsync();
        }

        public async Task<RoleView> GetById(int id)
        {
            return await _context.roleViews.FindAsync(id);
        }

        public async Task Add(RoleView roleView)
        {
            await _context.roleViews.AddAsync(roleView);
            await _context.SaveChangesAsync();
        }

        public async Task Update(RoleView roleView)
        {
            _context.roleViews.Update(roleView);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(int id)
        {
            var roleView = await _context.roleViews.FindAsync(id);
            if (roleView != null)
            {
                _context.roleViews.Remove(roleView);
                await _context.SaveChangesAsync();
            }
        }
    }
}
