using Entity.DTO.Operational;
using Service.Operational.Interface;
using System;
using System.Net;
using System.Net.Mail;
using Entity.Model.Operational;
using Repository.Operational.Interface;

namespace Service.Operational.Implements
{
    public class EmailService : IEmailService
    {
        private readonly IEmailRepository _emailRepository;

        public EmailService(IEmailRepository emailRepository)
        {
            _emailRepository = emailRepository;
        }

        public void SendEmail(EmailDto emailDto)
        {
            var mailMessage = new MailMessage
            {
                From = new MailAddress("juanmarico396@gmail.com"), // Cambia esto por tu correo
                Subject = "Nuevo mensaje de contacto",
                Body = $"Nombre: {emailDto.Name}<br>Email: {emailDto.Gmail}<br>Mensaje: {emailDto.Message}",
                IsBodyHtml = true
            };

            mailMessage.To.Add(emailDto.Gmail); // Puedes enviar a la dirección del contacto o a un correo fijo

            using (var smtpClient = new SmtpClient("smtp.gmail.com", 587)) // Cambia esto por tu servidor SMTP
            {
                smtpClient.Credentials = new NetworkCredential("juanmarico396@gmail.com", "vdzjeobbplmgrvei"); // Usa la contraseña de aplicación aquí
                smtpClient.EnableSsl = true;

                smtpClient.Send(mailMessage);
            }

            var emailEntity = new Email
            {
                Name = emailDto.Name,
                Gmail = emailDto.Gmail,
                Message = emailDto.Message
            };

            _emailRepository.AddEmail(emailEntity);
        }

    }
}
