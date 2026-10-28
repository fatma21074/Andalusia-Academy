using System;

namespace Domain.Models
{
    public class Notification
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public string Type { get; set; } = string.Empty; // registration | application | payment | enrollment
        public string Subject { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty; // short summary — NOT the full HTML email body
        public bool EmailSent { get; set; }
        public DateTime SentAt { get; set; } = DateTime.UtcNow;
    }
}