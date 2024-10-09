using AutoMapper;
using Entity.DTO.Operational;
using Entity.DTO.Security;
using Entity.Model.Security;
using Repository.Operational.Interface;
using Repository.Security.Interface;
using Service.Security.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Service.Security.Implements
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
     
        private readonly IPersonRepository _personRepository; // Añadir repositorio de personas
        private readonly IUserRoleRepository _userRoleRepository; // Repositorio para UserRole
        private readonly IMapper _mapper;

        public UserService(IUserRepository userRepository, IPersonRepository personRepository, IUserRoleRepository userRoleRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            
            _personRepository = personRepository; // Inicializar repositorio de personas
            _userRoleRepository = userRoleRepository; // Inicializar repositorio de UserRole
            _mapper = mapper;
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
            await _userRepository.ChangePassword(user, newPassword);
        }

        public string GenerateResetCode()
        {
            var random = new Random();
            return random.Next(100000, 999999).ToString(); // Código de 6 dígitos
        }

        public async Task<User> GetByEmail(string email)
        {
            return await _userRepository.GetByEmail(email);
        }





    }
}
