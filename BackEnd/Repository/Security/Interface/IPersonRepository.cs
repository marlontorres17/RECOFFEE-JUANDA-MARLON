using Entity.Model.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Security.Interface
{
    public interface IPersonRepository
    {
        Task<IEnumerable<Person>> GetAll();
        Task<Person> GetById(int id);
        Task Add(Person person);
        Task Update(Person person);
        Task Delete(int id);
        Person GetByIdentificationNumber(long identificationNumber);

        Task<IEnumerable<Person>> GetAdmins();
    }
}
