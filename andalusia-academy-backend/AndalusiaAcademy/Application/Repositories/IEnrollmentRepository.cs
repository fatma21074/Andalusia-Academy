using Domain.Models;

namespace Application.Repositories
{
    public interface IEnrollmentRepository
    {
        Task<List<Enrollment>> GetByUserIdAsync(int userId);
        Task<bool> ExistsAsync(int userId, int courseId);
        Task AddRangeAsync(IEnumerable<Enrollment> enrollments);
    }
}