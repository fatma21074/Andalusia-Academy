using Domain.Models;

namespace Application.Repositories
{
    public interface IApplicationRepository
    {
        Task<EnrollmentApplication?> GetByIdAsync(int id);
        Task<List<EnrollmentApplication>> GetByUserIdAsync(int userId);
        Task<bool> HasActiveApplicationAsync(int userId, int? courseId, int? programId);
        Task AddAsync(EnrollmentApplication application);
    }
}