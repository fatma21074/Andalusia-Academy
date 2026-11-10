using System.Net.Mail;
using Microsoft.Extensions.Options;

namespace Application.Integrations
{
    public class SmtpEmailSender : IEmailSender
    {
        private readonly EmailSettings _settings;
        public SmtpEmailSender(IOptions<EmailSettings> settings) => _settings = settings.Value;

        public async Task<bool> SendAsync(string toEmail, string toName, string subject, string htmlBody)
        {
            try
            {
                using var client = new SmtpClient(_settings.SmtpHost, _settings.SmtpPort);
                using var message = new MailMessage
                {
                    From = new MailAddress(_settings.FromAddress, _settings.FromName),
                    Subject = subject,
                    Body = htmlBody,
                    IsBodyHtml = true
                };
                message.To.Add(new MailAddress(toEmail, toName));

                await client.SendMailAsync(message);
                return true;
            }
            catch (SmtpException)
            {
                // Email is a nice-to-have, not something that should ever break registration,
                // an application, or a payment. A failed send is logged via Notification.EmailSent
                // = false, never thrown back up to interrupt the actual business operation.
                return false;
            }
        }
    }
}