using Microsoft.EntityFrameworkCore;
using Domain.Models;
using Application.Common;
using Application.Repositories;
using AndalusiaAcademy.Data;

namespace AndalusiaAcademy.Repositories
{
    public class CourseRepository : ICourseRepository
    {
        private readonly AppDbContext _context;
        public CourseRepository(AppDbContext context) => _context = context;

        public async Task<Course?> GetByIdAsync(int id)
        {
            return await _context.Courses
                .Include(c => c.Category)
                .Include(c => c.Instructor).ThenInclude(i => i.User)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<PagedResult<Course>> GetAllAsync(CourseFilterParams filter)
        {
            var query = _context.Courses
                .Include(c => c.Category)
                .Include(c => c.Instructor).ThenInclude(i => i.User)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(filter.Search))
                query = query.Where(c => c.Title.Contains(filter.Search));

            if (filter.CategoryId.HasValue)
                query = query.Where(c => c.CategoryId == filter.CategoryId.Value);

            if (!string.IsNullOrWhiteSpace(filter.Status))
                query = query.Where(c => c.Status == filter.Status);

            // Whitelisted sorting — never build SQL from a raw client string
            bool desc = string.Equals(filter.Order, "desc", StringComparison.OrdinalIgnoreCase);
            query = filter.SortBy?.ToLower() switch
            {
                "price" => desc ? query.OrderByDescending(c => c.Price) : query.OrderBy(c => c.Price),
                "title" => desc ? query.OrderByDescending(c => c.Title) : query.OrderBy(c => c.Title),
                "createdat" => desc ? query.OrderByDescending(c => c.CreatedAt) : query.OrderBy(c => c.CreatedAt),
                _ => query.OrderBy(c => c.Id)
            };

            var totalCount = await query.CountAsync();
            var data = await query
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            return new PagedResult<Course>
            {
                Data = data,
                Page = filter.Page,
                PageSize = filter.PageSize,
                TotalCount = totalCount
            };
        }
    }
}