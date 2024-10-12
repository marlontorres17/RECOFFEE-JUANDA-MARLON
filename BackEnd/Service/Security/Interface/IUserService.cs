using Entity.DTO.Operational;
using Entity.DTO.Security;
using Entity.Model.Security;
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

        // Métodos para el restablecimiento de contraseña
        Task<bool> SendResetCode(string email); // Enviar código de restablecimiento
        Task<bool> ResetPassword(string email, string newPassword, string resetCode); // Restablecer contraseña
        Task<bool> ValidateResetCode(string email, string resetCode); // Validar código de restablecimiento
        Task ChangePassword(User user, string newPassword); // Cambiar contraseña directamente
    }
}
