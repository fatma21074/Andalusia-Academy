using Domain.Models;
using Application.DTOs;
using Application.Repositories;
using Application.Integrations;

namespace Application.Services
{
    public class NotificationService
    {
        private readonly INotificationRepository _repo;
        private readonly IEmailSender _emailSender;

        public NotificationService(INotificationRepository repo, IEmailSender emailSender)
        {
            _repo = repo;
            _emailSender = emailSender;
        }

        // The one method every trigger point calls — logs the notification either way,
        // and separately records whether the email itself actually went out.
        public async Task NotifyAsync(User user, string type, string subject, string shortMessage, string heading, string bodyHtml)
        {
            var htmlEmail = EmailTemplate.Render(heading, bodyHtml);
            var sent = await _emailSender.SendAsync(user.Email, $"{user.FirstName} {user.LastName}", subject, htmlEmail);

            await _repo.AddAsync(new Notification
            {
                UserId = user.Id,
                Type = type,
                Subject = subject,
                Message = shortMessage,
                EmailSent = sent
            });
        }

        public async Task<List<NotificationDto>> GetMyNotificationsAsync(int userId)
        {
            var notifications = await _repo.GetByUserIdAsync(userId);
            return notifications.Select(n => new NotificationDto
            {
                Id = n.Id, Type = n.Type, Subject = n.Subject,
                Message = n.Message, SentAt = n.SentAt
            }).ToList();
        }
    }
}