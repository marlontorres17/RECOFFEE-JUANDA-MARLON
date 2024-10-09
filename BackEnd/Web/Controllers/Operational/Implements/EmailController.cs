using Entity.DTO.Operational;
using Microsoft.AspNetCore.Mvc;
using Service.Operational.Interface;
using Web.Controllers.Operational.Interface;

namespace Web.Controllers.Operational.Implements
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmailController : IEmailController // Implementación de la interfaz
    {
        private readonly IEmailService _emailService;

        public EmailController(IEmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost]
        public IActionResult SendEmail([FromBody] EmailDto emailDto)
        {
            // Validación manual
            if (string.IsNullOrWhiteSpace(emailDto.Name) ||
                string.IsNullOrWhiteSpace(emailDto.Gmail) ||
                string.IsNullOrWhiteSpace(emailDto.Message) ||
                !IsValidEmail(emailDto.Gmail)) // Asegúrate de validar el Gmail en lugar del Email
            {
                // Crea y devuelve un BadRequest manualmente
                return new BadRequestObjectResult("El nombre, correo y mensaje son obligatorios, y el correo debe ser válido.");
            }

            // Llama al servicio para enviar el correo
            _emailService.SendEmail(emailDto);

            // Crea y devuelve un Ok manualmente
            return new OkObjectResult("Correo enviado exitosamente");
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
