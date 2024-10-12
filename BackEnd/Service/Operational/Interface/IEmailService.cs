using Entity.DTO.Operational;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Operational.Interface
{
    public interface IEmailService
    {
        /// <summary>
        /// Enviar un correo electrónico de forma asíncrona.
        /// </summary>
        /// <param name="toEmail">El correo electrónico del destinatario.</param>
        /// <param name="subject">El asunto del correo.</param>
        /// <param name="body">El cuerpo del mensaje.</param>
        /// <returns>Una tarea que representa la operación de envío del correo.</returns>
        Task SendEmailAsync(string toEmail, string subject, string body);
    }
}
