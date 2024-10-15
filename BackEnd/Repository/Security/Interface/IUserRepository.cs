using Entity.Model.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Security.Interface
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAll();
        Task<User> GetById(int id);
        Task Add(User user);
        Task Update(User user);
        Task Delete(int id);

        Task ChangePassword(User user, string newPassword);

        Task<User> GetByEmail(string email);




    }
}
