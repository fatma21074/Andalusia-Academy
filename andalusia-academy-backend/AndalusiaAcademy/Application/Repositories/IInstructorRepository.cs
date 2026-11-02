using Domain.Models;

namespace Application.Repositories
{
    public interface IInstructorRepository
    {
        Task<Instructor?> GetInstructorByUserIdAsync(int userId);
        Task<List<Instructor>> GetAllInstructorsAsync();
        Task<List<Course>> GetMyCoursesAsync(int instructorId);
        Task<Course?> GetMyCourseAsync(int instructorId, int courseId);
        Task<List<Enrollment>> GetEnrolledStudentsAsync(int courseId);

        Task<List<Session>> GetSessionsForCourseAsync(int courseId);
        Task AddSessionAsync(Session session);
        Task<Session?> GetSessionForInstructorAsync(int instructorId, int sessionId);
        Task<List<Attendance>> GetAttendanceForSessionAsync(int sessionId);
        Task UpsertAttendanceAsync(int sessionId, int userId, string status);

        Task<List<Assignment>> GetAssignmentsForCourseAsync(int courseId);
        Task<Assignment?> GetAssignmentForInstructorAsync(int instructorId, int assignmentId);
        Task AddAssignmentAsync(Assignment assignment);
        Task<List<Submission>> GetSubmissionsForAssignmentAsync(int assignmentId);
        Task<Submission?> GetSubmissionByIdAsync(int submissionId);
        Task SaveChangesAsync();

        // Course materials
        Task<List<CourseMaterial>> GetMaterialsAsync(int courseId);
        Task<CourseMaterial?> GetMaterialForInstructorAsync(int instructorId, int materialId);
        Task AddMaterialAsync(CourseMaterial material);
        Task DeleteMaterialAsync(CourseMaterial material);
    }
}