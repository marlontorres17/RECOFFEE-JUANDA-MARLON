﻿using AutoMapper;
using Entity.DTO.Operational;
using Entity.DTO.Security;
using Entity.Model.Security;
using Repository.Operational.Interface;
using Repository.Security.Interface;
using Service.Security.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;
using BCrypt.Net;
using Service.Operational.Implements;
using Service.Operational.Interface;

namespace Service.Security.Implements
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        private readonly IPersonRepository _personRepository; // Añadir repositorio de personas
        private readonly IUserRoleRepository _userRoleRepository; // Repositorio para UserRole
        private readonly IMapper _mapper;
        private readonly IEmailService _emailService;

        public UserService(IUserRepository userRepository, IPersonRepository personRepository, IUserRoleRepository userRoleRepository,
           IMapper mapper, IEmailService emailService)
        {
            _userRepository = userRepository;

            _personRepository = personRepository; // Inicializar repositorio de personas
            _userRoleRepository = userRoleRepository; // Inicializar repositorio de UserRole
            _mapper = mapper;
            _emailService = emailService;
        }

        public async Task<IEnumerable<UserDto>> GetAll()
        {
            var users = await _userRepository.GetAll();
            return _mapper.Map<IEnumerable<UserDto>>(users);
        }

        public async Task<UserDto> GetById(int id)
        {
            var user = await _userRepository.GetById(id);
            return _mapper.Map<UserDto>(user);
        }

        public async Task Add(UserDto userDto)
        {
            var user = _mapper.Map<User>(userDto);
            await _userRepository.Add(user);
        }

        public async Task Update(UserDto userDto)
        {
            var user = _mapper.Map<User>(userDto);
            user.Password = HashPassword(userDto.Password);
            await _userRepository.Update(user);
        }

        public async Task Delete(int id)
        {
            await _userRepository.Delete(id);
        }

        public async Task AddUserAndPerson(UserDto userDto, PersonDto personDto, string roleName)
        {
            if (userDto == null) throw new ArgumentNullException(nameof(userDto));
            if (personDto == null) throw new ArgumentNullException(nameof(personDto));
            if (string.IsNullOrWhiteSpace(roleName)) throw new ArgumentNullException(nameof(roleName));

            var person = _mapper.Map<Person>(personDto);
            await _personRepository.Add(person);
            userDto.PersonId = person.Id;

            var user = _mapper.Map<User>(userDto);

            // Hashear la contraseña antes de guardar el usuario
            user.Password = HashPassword(userDto.Password);

            await _userRepository.Add(user);

            var role = await _userRoleRepository.GetRoleByName(roleName);
            if (role == null)
            {
                throw new Exception($"El rol '{roleName}' no existe.");
            }

            var userRole = new UserRole
            {
                UserId = user.Id,
                RoleId = role.Id
            };

            await _userRoleRepository.Add(userRole);
        }


        public async Task UpdateUserRole(int userId, string newRoleName)
        {
            // Obtiene el usuario por su ID
            var user = await _userRepository.GetById(userId);
            if (user == null)
            {
                throw new Exception("Usuario no encontrado.");
            }

            // Obtiene el nuevo rol por su nombre
            var newRole = await _userRoleRepository.GetRoleByName(newRoleName);
            if (newRole == null)
            {
                throw new Exception($"El rol '{newRoleName}' no existe.");
            }

            // Obtiene el rol actual del usuario
            var userRole = await _userRoleRepository.GetUserRoleByUserId(userId);
            if (userRole != null)
            {
                // Actualiza el ID del rol existente
                userRole.RoleId = newRole.Id;
                await _userRoleRepository.Update(userRole);
            }
            else
            {
                // Si el usuario no tiene un rol, crea uno nuevo
                var newUserRole = new UserRole
                {
                    UserId = userId,
                    RoleId = newRole.Id
                };
                await _userRoleRepository.Add(newUserRole);
            }
        }



        public async Task ChangePassword(User user, string newPassword)
        {
            // Hashear la nueva contraseña
            user.Password = HashPassword(newPassword);

            await _userRepository.ChangePassword(user, user.Password);
        }



        public async Task<User> GetByEmail(string email)
        {
            return await _userRepository.GetByEmail(email);
        }

        // Hash de la contraseña utilizando BCrypt
        private string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        // Verificación de la contraseña hasheada
        private bool VerifyPassword(string password, string hashedPassword)
        {
            return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
        }

        public string GenerateResetCode()
        {
            var random = new Random();
            return random.Next(100000, 999999).ToString(); // Genera un código de 6 dígitos
        }

        // Enviar código de restablecimiento por correo electrónico
        public async Task<bool> SendResetCode(string email)
        {
            var user = await _userRepository.GetByEmail(email);
            if (user == null) return false;

            // Genera el código de restablecimiento
            string resetCode = GenerateResetCode();

            // Asignar el código y establecer la fecha de expiración
            user.ResetCode = resetCode;
            user.ResetCodeExpiration = DateTime.UtcNow.AddHours(1); // Expira en 1 hora
            await _userRepository.Update(user);

            // Cuerpo del mensaje en formato HTML
            string messageBody = $@"
<div style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;'>
    <div style='max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 10px;'>
        <div style='text-align: center;'>
            <h1 style='color: #B34BFF; font-size: 36px; font-family: Avegreat; margin-bottom: 20px;'>Recoffee</h1>
        </div>
        <h2 style='color: #333;'>Solicitud para Restablecer tu Contraseña</h2>
        <p style='color: #555;'>Hola {user.UserName},</p>
        <p style='color: #555;'>
            Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. Por favor, utiliza el siguiente código de verificación para completar el proceso:
        </p>
        <div style='text-align: center; font-size: 24px; font-weight: bold; color: #B34BFF; margin: 20px 0;'>
            {resetCode}
        </div>
        <p style='color: #555; text-align: center;'>
            Tienes <strong>1 hora</strong> para utilizar este código antes de que expire.
        </p>
        
        <hr style='border: none; border-top: 1px solid #ccc; margin: 20px 0;' />
        <p style='color: #555; text-align: center;'>
            Este correo fue enviado porque solicitaste restablecer tu contraseña. Si no fuiste tú, por favor, ignora este mensaje o 
            <a href='recooffee@gmail.com' style='color: #B34BFF; text-decoration: none;'>infórmanos</a>.
        </p>
        <div style='background-color: #f3f3f3; padding: 10px; margin-top: 20px; font-size: 12px; color: #777;'>
            <p style='text-align: center;'>© {DateTime.Now.Year} Recoffee. Todos los derechos reservados.</p>
            <p style='color: #777; text-align: center; font-size: 12px;'>
                ¿Tienes algún problema? <a href='recooffee@gmail.com' style='color: #B34BFF; text-decoration: none;'>Contáctanos</a>.
            </p>
        </div>
    </div>
</div>";


            // Envía el código al correo del usuario
            await _emailService.SendEmailAsync(email, "Restablecimiento de Contraseña", messageBody, true); // true para HTML

            return true;
        }


        // Validación del código de restablecimiento
        public async Task<bool> ValidateResetCode(string email, string resetCode)
        {
            var user = await _userRepository.GetByEmail(email);
            if (user == null || user.ResetCodeExpiration == null || user.ResetCodeExpiration < DateTime.UtcNow)
            {
                return false; // Código inválido o expirado
            }

            return user.ResetCode == resetCode;
        }

        // Restablecimiento de contraseña
        public async Task<bool> ResetPassword(string email, string newPassword, string resetCode)
        {
            var user = await _userRepository.GetByEmail(email);
            if (user == null || !await ValidateResetCode(email, resetCode))
            {
                return false;
            }

            // Hashear la nueva contraseña
            user.Password = HashPassword(newPassword);
            user.ResetCode = null; // Limpiar el código de restablecimiento
            user.ResetCodeExpiration = null; // Limpiar la fecha de expiración

            await _userRepository.Update(user);
            return true;
        }





    }
}