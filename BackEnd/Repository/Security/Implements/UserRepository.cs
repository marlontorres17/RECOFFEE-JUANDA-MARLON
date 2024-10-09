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
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;

        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<User>> GetAll()
        {
            return await _context.users.ToListAsync();
        }

        public async Task<User> GetById(int id)
        {
            return await _context.users.FindAsync(id);
        }

        public async Task Add(User user)
        {
            await _context.users.AddAsync(user);
            await _context.SaveChangesAsync();
        }

        public async Task Update(User user)
        {
            _context.users.Update(user);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(int id)
        {
            var user = await _context.users.FindAsync(id);
            if (user != null)
            {
                _context.users.Remove(user);
                await _context.SaveChangesAsync();
            }
        }

        public async Task ChangePassword(User user, string newPassword)
        {
            user.Password = newPassword; // Aquí puedes agregar el hash de la contraseña si es necesario
            await Update(user); // Actualiza el usuario
        }

        public async Task<User> GetByEmail(string email)
        {
            return _context.users.SingleOrDefault(u => u.Person.Email == email);
        }



    }
}
