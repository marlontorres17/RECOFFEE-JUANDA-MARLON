using Service.Security.Interface;
using Entity.DTO;
using Entity.Model.Context;
using Entity.Model.Security;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using BCrypt.Net; // Asegúrate de tener esta referencia

namespace Web.Controllers.Implements
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LoginController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            try
            {
                // Buscar al usuario en la base de datos
                var user = await _context.users
                    .FirstOrDefaultAsync(u => u.UserName == loginRequest.UserName && u.State);

                // Verificar si el usuario existe y la contraseña es correcta
                if (user != null && VerifyPassword(loginRequest.Password, user.Password))
                {
                    // Obtener los roles del usuario
                    var roles = await _context.userRoles
                        .Where(ur => ur.UserId == user.Id && ur.State)
                        .Include(ur => ur.Role) // Incluir la entidad Role
                        .Select(ur => ur.Role.Name) // Seleccionar solo el nombre del rol
                        .ToListAsync();

                    // Obtener las vistas y sus módulos asociados a los roles
                    var viewsAndModules = await _context.roleViews
                        .Where(rv => roles.Contains(rv.Role.Name) && rv.State)
                        .Include(rv => rv.View)
                            .ThenInclude(v => v.Module) // Incluir la entidad Module a través de View
                        .Select(rv => new
                        {
                            ViewName = rv.View.Name,
                            ModuleName = rv.View.Module.Name
                        })
                        .ToListAsync();

                    var response = new
                    {
                        Message = "Inicio de sesión exitoso.", // Mensaje de éxito añadido
                        UserId = user.Id, // Agregar el ID del usuario
                        PersonId = user.PersonId,
                        Roles = roles,
                        Views = viewsAndModules.Select(vm => vm.ViewName).Distinct(),
                        Modules = viewsAndModules.Select(vm => vm.ModuleName).Distinct(),
                        User = new { user.UserName }
                    };

                    return Ok(response);
                }
                else
                {
                    return Unauthorized("Usuario o contraseña incorrectos.");
                }
            }
            catch (Exception ex)
            {
                // Captura el error y regresa un mensaje con detalles
                return StatusCode(500, $"Error en el servidor: {ex.Message}");
            }
        }

        // Método para verificar la contraseña
        private bool VerifyPassword(string password, string hashedPassword)
        {
            return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
        }

        public class LoginRequest
        {
            public string UserName { get; set; }
            public string Password { get; set; }
        }
    }
}
