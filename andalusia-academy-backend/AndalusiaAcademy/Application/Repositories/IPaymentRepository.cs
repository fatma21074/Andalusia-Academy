using Domain.Models;

namespace Application.Repositories
{
    public interface IPaymentRepository
    {
        Task<Payment?> GetByIdAsync(int id);
        Task<List<Payment>> GetByUserIdAsync(int userId);
        Task<Payment?> GetBySessionIdAsync(string sessionId);
        Task AddAsync(Payment payment);
        Task SaveChangesAsync();
    }
}