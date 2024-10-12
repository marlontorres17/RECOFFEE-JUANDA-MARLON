using Entity.DTO.Operational;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Web.Controllers.Operational.Interface
{
    public interface IEmailController
    {
        /// <summary>
        /// Envía un correo electrónico de forma asíncrona.
        /// </summary>
        /// <param name="emailDto">El DTO que contiene los datos necesarios para enviar el correo.</param>
        /// <returns>Una tarea que representa la operación de envío del correo.</returns>
        Task<IActionResult> SendMailAsync(EmailDto emailDto);
    }
}
