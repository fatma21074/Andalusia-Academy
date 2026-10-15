using Microsoft.EntityFrameworkCore;
using Domain.Models;
using Application.Repositories;
using AndalusiaAcademy.Data;

namespace AndalusiaAcademy.Repositories
{
    public class EnrollmentRepository : IEnrollmentRepository
    {
        private readonly AppDbContext _context;
        public EnrollmentRepository(AppDbContext context) => _context = context;

        public async Task<List<Enrollment>> GetByUserIdAsync(int userId)
        {
            return await _context.Enrollments
                .Include(e => e.Course)
                .Where(e => e.UserId == userId)
                .OrderByDescending(e => e.Id)
                .ToListAsync();
        }

        public async Task<bool> ExistsAsync(int userId, int courseId)
        {
            return await _context.Enrollments
                .AnyAsync(e => e.UserId == userId && e.CourseId == courseId);
        }

        public async Task AddRangeAsync(IEnumerable<Enrollment> enrollments)
        {
            _context.Enrollments.AddRange(enrollments);
            await _context.SaveChangesAsync();
        }
    }
}