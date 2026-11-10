using Microsoft.EntityFrameworkCore;
using Domain.Models;
using Application.Repositories;
using AndalusiaAcademy.Data;

namespace AndalusiaAcademy.Repositories
{
    public class LearnerRepository : ILearnerRepository
    {
        private readonly AppDbContext _context;
        public LearnerRepository(AppDbContext context) => _context = context;

        public async Task<List<Enrollment>> GetMyEnrollmentsAsync(int userId)
        {
            return await _context.Enrollments
                .Include(e => e.Course)
                .Where(e => e.UserId == userId)
                .OrderByDescending(e => e.EnrolledAt)
                .ToListAsync();
        }

        public async Task<Enrollment?> GetEnrollmentAsync(int userId, int courseId)
        {
            return await _context.Enrollments
                .FirstOrDefaultAsync(e => e.UserId == userId && e.CourseId == courseId);
        }

        public async Task<Course?> GetCourseWithLearningDataAsync(int courseId)
        {
            return await _context.Courses
                .Include(c => c.Instructor).ThenInclude(i => i.User)
                .Include(c => c.Materials)
                .Include(c => c.Sessions)
                .Include(c => c.Assignments)
                .FirstOrDefaultAsync(c => c.Id == courseId);
        }

        public async Task<List<Attendance>> GetMyAttendanceAsync(int userId, int courseId)
        {
            return await _context.Attendances
                .Include(a => a.Session)
                .Where(a => a.UserId == userId && a.Session.CourseId == courseId)
                .ToListAsync();
        }

        public async Task<List<Submission>> GetMySubmissionsAsync(int userId, int courseId)
        {
            return await _context.Submissions
                .Include(s => s.Assignment)
                .Where(s => s.UserId == userId && s.Assignment.CourseId == courseId)
                .ToListAsync();
        }

        public async Task<Assignment?> GetAssignmentAsync(int assignmentId)
        {
            return await _context.Assignments.FindAsync(assignmentId);
        }

        public async Task<Submission?> GetMySubmissionForAssignmentAsync(int userId, int assignmentId)
        {
            return await _context.Submissions
                .FirstOrDefaultAsync(s => s.UserId == userId && s.AssignmentId == assignmentId);
        }

        public async Task AddSubmissionAsync(Submission submission)
        {
            _context.Submissions.Add(submission);
            await _context.SaveChangesAsync();
        }
    }
}