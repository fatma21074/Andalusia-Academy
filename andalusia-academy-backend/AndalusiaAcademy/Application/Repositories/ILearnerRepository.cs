using Domain.Models;

namespace Application.Repositories
{
    public interface ILearnerRepository
    {
        Task<List<Enrollment>> GetMyEnrollmentsAsync(int userId);
        Task<Enrollment?> GetEnrollmentAsync(int userId, int courseId);
        Task<Course?> GetCourseWithLearningDataAsync(int courseId);
        Task<List<Attendance>> GetMyAttendanceAsync(int userId, int courseId);
        Task<List<Submission>> GetMySubmissionsAsync(int userId, int courseId);
        Task<Assignment?> GetAssignmentAsync(int assignmentId);
        Task<Submission?> GetMySubmissionForAssignmentAsync(int userId, int assignmentId);
        Task AddSubmissionAsync(Submission submission);
    }
}