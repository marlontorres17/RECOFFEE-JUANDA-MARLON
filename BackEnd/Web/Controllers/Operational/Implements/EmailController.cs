using Entity.DTO.Operational;
using Microsoft.AspNetCore.Mvc;
using Service.Operational.Interface;
using Web.Controllers.Operational.Interface;

namespace Web.Controllers.Operational.Implements
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmailController : ControllerBase, IEmailController // Implementación de la interfaz
    {
        private readonly IEmailService _emailService;

        public EmailController(IEmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost]
        public async Task<IActionResult> SendMailAsync([FromBody] EmailDto emailDto) // Cambiar a async
        {
            // Validación manual
            if (string.IsNullOrWhiteSpace(emailDto.Name) ||
                string.IsNullOrWhiteSpace(emailDto.Gmail) ||
                string.IsNullOrWhiteSpace(emailDto.Message) ||
                !IsValidEmail(emailDto.Gmail)) // Validación del correo
            {
                return BadRequest("El nombre, correo y mensaje son obligatorios, y el correo debe ser válido.");
            }

            // Llama al servicio para enviar el correo usando el método asíncrono
            await _emailService.SendEmailAsync(emailDto.Gmail, "Asunto del correo", emailDto.Message);

            return Ok("Correo enviado exitosamente");
        }

        // Método para validar el formato del correo
        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }
    }
}
