using Domain.Models;

namespace Application.Repositories
{
    public interface INotificationRepository
    {
        Task AddAsync(Notification notification);
        Task<List<Notification>> GetByUserIdAsync(int userId);
    }
}