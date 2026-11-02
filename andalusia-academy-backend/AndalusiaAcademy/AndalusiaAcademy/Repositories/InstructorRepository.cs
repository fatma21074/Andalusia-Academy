using Microsoft.EntityFrameworkCore;
using Domain.Models;
using Application.Repositories;
using AndalusiaAcademy.Data;

namespace AndalusiaAcademy.Repositories
{
    public class InstructorRepository : IInstructorRepository
    {
        private readonly AppDbContext _context;
        public InstructorRepository(AppDbContext context) => _context = context;

        public async Task<Instructor?> GetInstructorByUserIdAsync(int userId)
        {
            return await _context.Instructors.FirstOrDefaultAsync(i => i.UserId == userId);
        }

        public async Task<List<Instructor>> GetAllInstructorsAsync()
        {
            return await _context.Instructors
                .Include(i => i.User)
                .OrderBy(i => i.User.FirstName).ThenBy(i => i.User.LastName)
                .ToListAsync();
        }

        public async Task<List<Course>> GetMyCoursesAsync(int instructorId)
        {
            return await _context.Courses
                .Where(c => c.InstructorId == instructorId)
                .ToListAsync();
        }

        public async Task<Course?> GetMyCourseAsync(int instructorId, int courseId)
        {
            return await _context.Courses
                .FirstOrDefaultAsync(c => c.Id == courseId && c.InstructorId == instructorId);
        }

        public async Task<List<Enrollment>> GetEnrolledStudentsAsync(int courseId)
        {
            return await _context.Enrollments
                .Include(e => e.User)
                .Where(e => e.CourseId == courseId)
                .ToListAsync();
        }

        // ---------------- Sessions ----------------

        public async Task<List<Session>> GetSessionsForCourseAsync(int courseId)
        {
            return await _context.Sessions
                .Include(s => s.AttendanceRecords)
                .Where(s => s.CourseId == courseId)
                .OrderBy(s => s.SessionDate).ThenBy(s => s.StartTime)
                .ToListAsync();
        }

        public async Task AddSessionAsync(Session session)
        {
            _context.Sessions.Add(session);
            await _context.SaveChangesAsync();
        }

        public async Task<Session?> GetSessionForInstructorAsync(int instructorId, int sessionId)
        {
            return await _context.Sessions
                .FirstOrDefaultAsync(s => s.Id == sessionId && s.InstructorId == instructorId);
        }

        public async Task<List<Attendance>> GetAttendanceForSessionAsync(int sessionId)
        {
            return await _context.Attendances.Where(a => a.SessionId == sessionId).ToListAsync();
        }

        public async Task UpsertAttendanceAsync(int sessionId, int userId, string status)
        {
            var existing = await _context.Attendances
                .FirstOrDefaultAsync(a => a.SessionId == sessionId && a.UserId == userId);

            if (existing is not null)
                existing.Status = status;
            else
                _context.Attendances.Add(new Attendance { SessionId = sessionId, UserId = userId, Status = status });
        }

        // ---------------- Assignments ----------------

        public async Task<List<Assignment>> GetAssignmentsForCourseAsync(int courseId)
        {
            return await _context.Assignments
                .Include(a => a.Submissions)
                .Where(a => a.CourseId == courseId)
                .OrderBy(a => a.DueDate ?? DateTime.MaxValue).ThenBy(a => a.Id)
                .ToListAsync();
        }

        public async Task<Assignment?> GetAssignmentForInstructorAsync(int instructorId, int assignmentId)
        {
            return await _context.Assignments
                .Include(a => a.Course)
                .FirstOrDefaultAsync(a => a.Id == assignmentId && a.Course.InstructorId == instructorId);
        }

        public async Task AddAssignmentAsync(Assignment assignment)
        {
            _context.Assignments.Add(assignment);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Submission>> GetSubmissionsForAssignmentAsync(int assignmentId)
        {
            return await _context.Submissions
                .Include(s => s.User)
                .Where(s => s.AssignmentId == assignmentId)
                .ToListAsync();
        }

        public async Task<Submission?> GetSubmissionByIdAsync(int submissionId)
        {
            return await _context.Submissions.FindAsync(submissionId);
        }

        // ---------------- Course materials ----------------

        public async Task<List<CourseMaterial>> GetMaterialsAsync(int courseId) =>
            await _context.CourseMaterials
                .Where(m => m.CourseId == courseId)
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();

        // Ownership is baked into the query, same pattern as GetAssignmentForInstructorAsync:
        // a material is only found if its course belongs to this instructor.
        public async Task<CourseMaterial?> GetMaterialForInstructorAsync(int instructorId, int materialId) =>
            await _context.CourseMaterials
                .Include(m => m.Course)
                .FirstOrDefaultAsync(m => m.Id == materialId && m.Course.InstructorId == instructorId);

        public async Task AddMaterialAsync(CourseMaterial material)
        {
            _context.CourseMaterials.Add(material);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteMaterialAsync(CourseMaterial material)
        {
            _context.CourseMaterials.Remove(material);
            await _context.SaveChangesAsync();
        }

        public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
    }
}