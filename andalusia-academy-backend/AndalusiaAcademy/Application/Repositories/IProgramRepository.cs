using Domain.Models;
using Application.Common;

namespace Application.Repositories
{
    public interface IProgramRepository
    {
        Task<AcademyProgram?> GetByIdAsync(int id);
        Task<PagedResult<AcademyProgram>> GetAllAsync(ProgramFilterParams filter);
    }
}