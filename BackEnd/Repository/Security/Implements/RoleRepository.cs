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
    public class RoleRepository : IRoleRepository
    {
        private readonly ApplicationDbContext _context;

        public RoleRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Role>> GetAll()
        {
            return await _context.roles.ToListAsync();
        }

        public async Task<Role> GetById(int id)
        {
            return await _context.roles.FindAsync(id);
        }

        public async Task Add(Role role)
        {
            await _context.roles.AddAsync(role);
            await _context.SaveChangesAsync();
        }

        public async Task Update(Role role)
        {
            _context.roles.Update(role);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(int id)
        {
            var role = await _context.roles.FindAsync(id);
            if (role != null)
            {
                _context.roles.Remove(role);
                await _context.SaveChangesAsync();
            }
        }
    }
}
