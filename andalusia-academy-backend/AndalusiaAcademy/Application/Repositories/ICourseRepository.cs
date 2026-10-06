using Domain.Models;
using Application.Common;

namespace Application.Repositories
{
    public interface ICourseRepository
    {
        Task<Course?> GetByIdAsync(int id);
        Task<PagedResult<Course>> GetAllAsync(CourseFilterParams filter);
    }
}