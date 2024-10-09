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
    public class DepartmentRepository : IDepartmentRepository
    {
        private readonly ApplicationDbContext _context;

        public DepartmentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Department>> GetAll()
        {
            return await _context.departments.ToListAsync();
        }

        public async Task<Department> GetById(int id)
        {
            return await _context.departments.FindAsync(id);
        }

        public async Task Add(Department department)
        {
            await _context.departments.AddAsync(department);
            await _context.SaveChangesAsync();
        }

        public async Task Update(Department department)
        {
            _context.departments.Update(department);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(int id)
        {
            var department = await _context.departments.FindAsync(id);
            if (department != null)
            {
                _context.departments.Remove(department);
                await _context.SaveChangesAsync();
            }
        }
    }
}
