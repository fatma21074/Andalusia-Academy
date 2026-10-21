using Domain.Models;

namespace Application.Repositories
{
    public interface IInstructorRepository
    {
        Task<Instructor?> GetInstructorByUserIdAsync(int userId);
        Task<List<Course>> GetMyCoursesAsync(int instructorId);
        Task<Course?> GetMyCourseAsync(int instructorId, int courseId);
        Task<List<Enrollment>> GetEnrolledStudentsAsync(int courseId);
        Task<Session?> GetSessionForInstructorAsync(int instructorId, int sessionId);
        Task<List<Attendance>> GetAttendanceForSessionAsync(int sessionId);
        Task UpsertAttendanceAsync(int sessionId, int userId, string status);
        Task<Assignment?> GetAssignmentForInstructorAsync(int instructorId, int assignmentId);
        Task AddAssignmentAsync(Assignment assignment);
        Task<List<Submission>> GetSubmissionsForAssignmentAsync(int assignmentId);
        Task<Submission?> GetSubmissionByIdAsync(int submissionId);
        Task SaveChangesAsync();
    }
}