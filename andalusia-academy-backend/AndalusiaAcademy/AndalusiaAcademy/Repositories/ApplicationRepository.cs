using Microsoft.EntityFrameworkCore;
using Domain.Models;
using Application.Repositories;
using AndalusiaAcademy.Data;

namespace AndalusiaAcademy.Repositories
{
    public class ApplicationRepository : IApplicationRepository
    {
        private readonly AppDbContext _context;
        public ApplicationRepository(AppDbContext context) => _context = context;

        public async Task<EnrollmentApplication?> GetByIdAsync(int id)
        {
            return await _context.Applications
                .Include(a => a.Course)
                .Include(a => a.Program)
                .Include(a => a.Payment)
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<List<EnrollmentApplication>> GetByUserIdAsync(int userId)
        {
            return await _context.Applications
                .Include(a => a.Course)
                .Include(a => a.Program)
                .Include(a => a.Payment)
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.AppliedAt)
                .ToListAsync();
        }

        public async Task<bool> HasActiveApplicationAsync(int userId, int? courseId, int? programId)
        {
            return await _context.Applications.AnyAsync(a =>
                a.UserId == userId &&
                a.Status != "rejected" &&
                a.CourseId == courseId &&
                a.ProgramId == programId);
        }

        public async Task AddAsync(EnrollmentApplication application)
        {
            _context.Applications.Add(application);
            await _context.SaveChangesAsync();
        }
    }
}
