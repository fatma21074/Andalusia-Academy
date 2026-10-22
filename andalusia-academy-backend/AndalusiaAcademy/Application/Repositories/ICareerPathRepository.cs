using Domain.Models;
using Application.Common;

namespace Application.Repositories
{
    public interface ICareerPathRepository
    {
        Task<CareerPath?> GetByIdAsync(int id);
        Task<PagedResult<CareerPath>> GetAllAsync(CareerPathFilterParams filter);
    }
}