using Service.Security.Interface;
using Entity.DTO;
using Entity.Model.Context;
using Entity.Model.Security;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using BCrypt.Net;
using Entity.Model.Operational; // Asegúrate de tener esta referencia

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
                    // Verificar si el usuario tiene asociado un PersonId
                    if (user.PersonId > 0) // PersonId es no nullable (int)
                    {
                        // Buscar el FarmId de la finca asociada a la persona
                        var farmId = await _context.collectorFarms
                            .Where(cf => cf.PersonId == user.PersonId) // Filtrar por PersonId del usuario
                            .Select(cf => cf.FarmId) // Seleccionar el FarmId de la finca
                            .FirstOrDefaultAsync(); // Obtener el primer FarmId encontrado o 0 si no hay ninguno

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

                        // Construir la respuesta
                        var response = new
                        {
                            Message = "Inicio de sesión exitoso.",
                            UserId = user.Id, // ID del usuario
                            PersonId = user.PersonId, // ID de la persona
                            FarmId = farmId > 0 ? farmId : (int?)null, // ID de la finca asociada o null si no hay finca
                            Roles = roles, // Lista de roles del usuario
                            Views = viewsAndModules.Select(vm => vm.ViewName).Distinct(), // Vistas asociadas a los roles
                            Modules = viewsAndModules.Select(vm => vm.ModuleName).Distinct(), // Módulos asociados a las vistas
                            User = new { user.UserName } // Información del usuario
                        };

                        return Ok(response); // Devolver respuesta exitosa
                    }
                    else
                    {
                        return BadRequest("El usuario no tiene un PersonId válido.");
                    }
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