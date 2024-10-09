using Entity.DTO.Security;
using Entity.Model.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Security.Interface
{
    public interface IPersonService
    {
        Task<IEnumerable<PersonDto>> GetAll();
        Task<PersonDto> GetById(int id);
        Task Add(PersonDto personDto);
        Task Update(PersonDto personDto);
        Task Delete(int id);
        Task<IEnumerable<Person>> GetAdmins();
    }
}
