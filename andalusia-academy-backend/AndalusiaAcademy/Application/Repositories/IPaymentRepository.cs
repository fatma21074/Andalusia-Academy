using Domain.Models;

namespace Application.Repositories
{
    public interface IPaymentRepository
    {
        Task<List<Payment>> GetByUserIdAsync(int userId);
        Task AddAsync(Payment payment);
    }
}