using Entity.DTO.Operational;
using Service.Operational.Interface;
using System;
using System.Net;
using System.Net.Mail;
using Entity.Model.Operational;
using Repository.Operational.Interface;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

public class EmailService : IEmailService
{
    private readonly string _smtpServer;
    private readonly int _smtpPort;
    private readonly string _smtpUser;
    private readonly string _smtpPass;

    public EmailService(IConfiguration configuration)
    {
        // Cargar configuración desde appsettings.json
        _smtpServer = configuration["SmtpSettings:Server"];
        _smtpPort = int.Parse(configuration["SmtpSettings:Port"]);
        _smtpUser = configuration["SmtpSettings:Username"];
        _smtpPass = configuration["SmtpSettings:Password"];
    }

    public async Task SendEmailAsync(string toEmail, string subject, string body)
    {
        // Crea el cliente SMTP
        using (var smtpClient = new SmtpClient(_smtpServer, _smtpPort))
        {
            smtpClient.Credentials = new NetworkCredential(_smtpUser, _smtpPass);
            smtpClient.EnableSsl = true;

            // Crea el mensaje de correo
            var mailMessage = new MailMessage
            {
                From = new MailAddress(_smtpUser),
                Subject = subject,
                Body = body,
                IsBodyHtml = true,
            };

            mailMessage.To.Add(toEmail);

            // Envía el correo
            try
            {
                await smtpClient.SendMailAsync(mailMessage);
            }
            catch (SmtpException ex)
            {
                Console.WriteLine($"Error al enviar el correo: {ex.Message}");
                throw;
            }
        }
    }
}