using Microsoft.EntityFrameworkCore;
using Domain.Models;
using Application.Repositories;
using AndalusiaAcademy.Data;

namespace AndalusiaAcademy.Repositories
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly AppDbContext _context;
        public NotificationRepository(AppDbContext context) => _context = context;

        public async Task AddAsync(Notification notification)
        {
            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Notification>> GetByUserIdAsync(int userId)
        {
            return await _context.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.SentAt)
                .ToListAsync();
        }
    }
}