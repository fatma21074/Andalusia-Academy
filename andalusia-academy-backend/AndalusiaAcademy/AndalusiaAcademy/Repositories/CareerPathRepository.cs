using Microsoft.EntityFrameworkCore;
using Domain.Models;
using Application.Common;
using Application.Repositories;
using AndalusiaAcademy.Data;

namespace AndalusiaAcademy.Repositories
{
    public class CareerPathRepository : ICareerPathRepository
    {
        private readonly AppDbContext _context;
        public CareerPathRepository(AppDbContext context) => _context = context;

        public async Task<CareerPath?> GetByIdAsync(int id)
        {
            return await _context.CareerPaths
                .Include(cp => cp.CareerPathPrograms).ThenInclude(cpp => cpp.Program).ThenInclude(p => p.Category)
                .Include(cp => cp.CareerPathPrograms).ThenInclude(cpp => cpp.Program).ThenInclude(p => p.ProgramCourses).ThenInclude(pc => pc.Course).ThenInclude(c => c.Category)
                .Include(cp => cp.CareerPathPrograms).ThenInclude(cpp => cpp.Program).ThenInclude(p => p.ProgramCourses).ThenInclude(pc => pc.Course).ThenInclude(c => c.Instructor).ThenInclude(i => i.User)
                .FirstOrDefaultAsync(cp => cp.Id == id);
        }

        public async Task<PagedResult<CareerPath>> GetAllAsync(CareerPathFilterParams filter)
        {
            var query = _context.CareerPaths.AsQueryable();

            if (!string.IsNullOrWhiteSpace(filter.Search))
                query = query.Where(cp => cp.Title.Contains(filter.Search));

            query = query.OrderBy(cp => cp.Id);

            var totalCount = await query.CountAsync();
            var data = await query
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            return new PagedResult<CareerPath>
            {
                Data = data,
                Page = filter.Page,
                PageSize = filter.PageSize,
                TotalCount = totalCount
            };
        }
    }
}