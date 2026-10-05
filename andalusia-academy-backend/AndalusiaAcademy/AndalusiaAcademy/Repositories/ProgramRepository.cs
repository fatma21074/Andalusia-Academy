using Microsoft.EntityFrameworkCore;
using Domain.Models;
using Application.Common;
using Application.Repositories;
using AndalusiaAcademy.Data;

namespace AndalusiaAcademy.Repositories
{
    public class ProgramRepository : IProgramRepository
    {
        private readonly AppDbContext _context;
        public ProgramRepository(AppDbContext context) => _context = context;

        public async Task<AcademyProgram?> GetByIdAsync(int id)
        {
            return await _context.AcademyPrograms
                .Include(p => p.Category)
                .Include(p => p.ProgramCourses).ThenInclude(pc => pc.Course).ThenInclude(c => c.Category)
                .Include(p => p.ProgramCourses).ThenInclude(pc => pc.Course).ThenInclude(c => c.Instructor).ThenInclude(i => i.User)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<PagedResult<AcademyProgram>> GetAllAsync(ProgramFilterParams filter)
        {
            var query = _context.AcademyPrograms
                .Include(p => p.Category)
                .Include(p => p.ProgramCourses)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(filter.Search))
                query = query.Where(p => p.Title.Contains(filter.Search));

            query = query.OrderBy(p => p.Id);

            var totalCount = await query.CountAsync();
            var data = await query
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            return new PagedResult<AcademyProgram>
            {
                Data = data,
                Page = filter.Page,
                PageSize = filter.PageSize,
                TotalCount = totalCount
            };
        }
    }
}