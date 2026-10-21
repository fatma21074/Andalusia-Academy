using Domain.Models;
using Application.DTOs;
using Application.Common;
using Application.Repositories;

namespace Application.Services
{
    public class InstructorService
    {
        private readonly IInstructorRepository _repo;

        public InstructorService(IInstructorRepository repo) => _repo = repo;

        private async Task<Instructor?> GetInstructorAsync(int userId) =>
            await _repo.GetInstructorByUserIdAsync(userId);

        public async Task<OperationResult<List<InstructorCourseDto>>> GetMyCoursesAsync(int userId)
        {
            var instructor = await GetInstructorAsync(userId);
            if (instructor is null)
                return OperationResult<List<InstructorCourseDto>>.Fail(OperationStatus.NotFound, "No instructor profile found for this account.");

            var courses = await _repo.GetMyCoursesAsync(instructor.Id);
            var result = new List<InstructorCourseDto>();
            foreach (var c in courses)
            {
                var students = await _repo.GetEnrolledStudentsAsync(c.Id);
                result.Add(new InstructorCourseDto
                {
                    CourseId = c.Id, Title = c.Title, Status = c.Status, StudentCount = students.Count
                });
            }
            return OperationResult<List<InstructorCourseDto>>.Ok(result);
        }

        public async Task<OperationResult<List<EnrolledStudentDto>>> GetStudentsAsync(int userId, int courseId)
        {
            var instructor = await GetInstructorAsync(userId);
            if (instructor is null)
                return OperationResult<List<EnrolledStudentDto>>.Fail(OperationStatus.NotFound, "No instructor profile found for this account.");

            var course = await _repo.GetMyCourseAsync(instructor.Id, courseId);
            if (course is null)
                return OperationResult<List<EnrolledStudentDto>>.Fail(OperationStatus.NotFound, "Course not found, or it isn't yours.");

            var enrollments = await _repo.GetEnrolledStudentsAsync(courseId);
            var result = enrollments.Select(e => new EnrolledStudentDto
            {
                UserId = e.UserId,
                FirstName = e.User.FirstName,
                LastName = e.User.LastName,
                Email = e.User.Email,
                EnrolledAt = e.EnrolledAt
            }).ToList();
            return OperationResult<List<EnrolledStudentDto>>.Ok(result);
        }

        public async Task<OperationResult<object>> MarkAttendanceAsync(int userId, int sessionId, MarkAttendanceDto request)
        {
            var instructor = await GetInstructorAsync(userId);
            if (instructor is null)
                return OperationResult<object>.Fail(OperationStatus.NotFound, "No instructor profile found for this account.");

            var session = await _repo.GetSessionForInstructorAsync(instructor.Id, sessionId);
            if (session is null)
                return OperationResult<object>.Fail(OperationStatus.NotFound, "Session not found, or it isn't yours.");

            foreach (var entry in request.Entries)
                await _repo.UpsertAttendanceAsync(sessionId, entry.UserId, entry.Status);

            await _repo.SaveChangesAsync();
            return OperationResult<object>.Ok(new { message = $"Attendance saved for {request.Entries.Count} student(s)." });
        }

        public async Task<OperationResult<object>> CreateAssignmentAsync(int userId, int courseId, CreateAssignmentDto request)
        {
            var instructor = await GetInstructorAsync(userId);
            if (instructor is null)
                return OperationResult<object>.Fail(OperationStatus.NotFound, "No instructor profile found for this account.");

            var course = await _repo.GetMyCourseAsync(instructor.Id, courseId);
            if (course is null)
                return OperationResult<object>.Fail(OperationStatus.NotFound, "Course not found, or it isn't yours.");

            await _repo.AddAssignmentAsync(new Assignment
            {
                CourseId = courseId,
                Title = request.Title,
                Description = request.Description,
                DueDate = request.DueDate
            });
            return OperationResult<object>.Ok(new { message = "Assignment created." });
        }

        public async Task<OperationResult<List<SubmissionForInstructorDto>>> GetSubmissionsAsync(int userId, int assignmentId)
        {
            var instructor = await GetInstructorAsync(userId);
            if (instructor is null)
                return OperationResult<List<SubmissionForInstructorDto>>.Fail(OperationStatus.NotFound, "No instructor profile found for this account.");

            var assignment = await _repo.GetAssignmentForInstructorAsync(instructor.Id, assignmentId);
            if (assignment is null)
                return OperationResult<List<SubmissionForInstructorDto>>.Fail(OperationStatus.NotFound, "Assignment not found, or it isn't yours.");

            var submissions = await _repo.GetSubmissionsForAssignmentAsync(assignmentId);
            var result = submissions.Select(s => new SubmissionForInstructorDto
            {
                Id = s.Id, UserId = s.UserId, StudentName = $"{s.User.FirstName} {s.User.LastName}",
                FileUrl = s.FileUrl, SubmittedAt = s.SubmittedAt, Status = s.Status, Score = s.Score, Feedback = s.Feedback
            }).ToList();
            return OperationResult<List<SubmissionForInstructorDto>>.Ok(result);
        }

        public async Task<OperationResult<object>> GradeSubmissionAsync(int userId, int submissionId, GradeSubmissionDto request)
        {
            var instructor = await GetInstructorAsync(userId);
            if (instructor is null)
                return OperationResult<object>.Fail(OperationStatus.NotFound, "No instructor profile found for this account.");

            var submission = await _repo.GetSubmissionByIdAsync(submissionId);
            if (submission is null)
                return OperationResult<object>.Fail(OperationStatus.NotFound, "Submission not found.");

            var assignment = await _repo.GetAssignmentForInstructorAsync(instructor.Id, submission.AssignmentId);
            if (assignment is null)
                return OperationResult<object>.Fail(OperationStatus.NotFound, "This submission isn't for one of your assignments.");

            submission.Score = request.Score;
            submission.Feedback = request.Feedback;
            submission.Status = "graded";
            await _repo.SaveChangesAsync();

            return OperationResult<object>.Ok(new { message = "Graded." });
        }
    }
}