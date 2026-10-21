using Domain.Models;
using Application.Common;

namespace Application.Repositories
{
    public interface ICourseRepository
    {
        Task<Course?> GetByIdAsync(int id);
        Task<PagedResult<Course>> GetAllAsync(CourseFilterParams filter);
        Task AddAsync(Course course);
        Task<bool> UpdateAsync(int id, Action<Course> apply);
        Task<bool> DeleteAsync(int id);
    }
}