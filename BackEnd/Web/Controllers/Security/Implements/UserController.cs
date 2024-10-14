using Entity.DTO;
using Entity.DTO.Operational;
using Entity.DTO.Security;
using Microsoft.AspNetCore.Mvc;
using Service.Security.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;
using Web.Controllers.Security.Interface;

namespace Web.Controller.Implements
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase, IUserController
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetAll()
        {
            var users = await _userService.GetAll();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetById(int id)
        {
            var user = await _userService.GetById(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [HttpPost]
        public async Task<IActionResult> Add(UserDto userDto)
        {
            await _userService.Add(userDto);
            return CreatedAtAction(nameof(GetById), new { id = userDto.Id }, userDto);
        }

        [HttpPost("register")]
        public async Task<IActionResult> AddUserAndPerson([FromBody] UserPersonRoleDto userAndPersonDto)
        {
            if (userAndPersonDto == null || string.IsNullOrWhiteSpace(userAndPersonDto.RoleName))
            {
                return BadRequest("El objeto UserPersonRoleDto o el roleName no pueden ser nulos o vacíos.");
            }

            await _userService.AddUserAndPerson(userAndPersonDto.User, userAndPersonDto.Person, userAndPersonDto.RoleName);
            return CreatedAtAction(nameof(GetById), new { id = userAndPersonDto.User.Id }, userAndPersonDto.User);
        }







        [HttpPut("{id}")]
        public async Task<IActionResult> Update(UserDto userDto)
        {
            await _userService.Update(userDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _userService.Delete(id);
            return NoContent();
        }
        [HttpPut("{id}/role")]
        public async Task<IActionResult> UpdateUserRole(int id, [FromBody] string newRoleName)
        {
            if (string.IsNullOrWhiteSpace(newRoleName))
            {
                return BadRequest("El nuevo nombre del rol no puede ser nulo o vacío.");
            }

            try
            {
                // Llama al servicio para actualizar el rol del usuario.
                await _userService.UpdateUserRole(id, newRoleName);
                return Ok("Rol actualizado exitosamente.");
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        // Endpoint para solicitar el restablecimiento de contraseña
        public class ForgotPasswordRequest
        {
            public string Email { get; set; }
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email))
            {
                return BadRequest("El correo electrónico no puede estar vacío.");
            }

            var result = await _userService.SendResetCode(request.Email);
            if (!result)
            {
                return NotFound("No se encontró un usuario con ese correo.");
            }

            return Ok("Se ha enviado un código de restablecimiento a tu correo electrónico.");
        }

        // Endpoint para restablecer la contraseña
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto model)
        {
            if (string.IsNullOrWhiteSpace(model.Email) || string.IsNullOrWhiteSpace(model.ResetCode) || string.IsNullOrWhiteSpace(model.NewPassword))
            {
                return BadRequest("Todos los campos son obligatorios.");
            }

            var result = await _userService.ResetPassword(model.Email, model.NewPassword, model.ResetCode);
            if (!result)
            {
                return BadRequest("El código de restablecimiento es inválido o ha expirado.");
            }

            return Ok("La contraseña ha sido restablecida exitosamente.");
        }





    }
}