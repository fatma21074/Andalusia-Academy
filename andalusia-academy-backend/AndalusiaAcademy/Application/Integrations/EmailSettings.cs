namespace Application.Integrations
{
    public class EmailSettings
    {
        public string SmtpHost { get; set; } = "localhost";
        public int SmtpPort { get; set; } = 25; // smtp4dev's default
        public string FromAddress { get; set; } = "no-reply@andalusia.academy";
        public string FromName { get; set; } = "Andalusia Academy";
    }
}