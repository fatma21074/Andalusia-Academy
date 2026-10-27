namespace Application.Integrations
{
    public interface IEmailSender
    {
        Task<bool> SendAsync(string toEmail, string toName, string subject, string htmlBody);
    }
}