using Entity.DTO.Operational;
using Entity.DTO.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Security.Interface
{
    public interface IUserService
    {
        Task<IEnumerable<UserDto>> GetAll();
        Task<UserDto> GetById(int id);
        Task Add(UserDto userDto);
        Task Update(UserDto userDto);
        Task Delete(int id);

        Task UpdateUserRole(int userId, string newRoleName);
        Task AddUserAndPerson(UserDto userDto, PersonDto personDto, string roleName);
        //Task AddUserAndPerson(UserDto userDto, PersonDto personDto, int roleId); // Modificado para incluir roleId
    }
}
