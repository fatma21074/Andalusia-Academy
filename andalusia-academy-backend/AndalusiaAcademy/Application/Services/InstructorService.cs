using System.Globalization;
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

        // ---------------- Sessions ----------------

        private static InstructorSessionDto ToSessionDto(Session s) => new()
        {
            Id = s.Id,
            SessionDate = s.SessionDate,
            StartTime = s.StartTime,
            EndTime = s.EndTime,
            Status = s.Status,
            MarkedCount = s.AttendanceRecords.Count
        };

        public async Task<OperationResult<List<InstructorSessionDto>>> GetSessionsAsync(int userId, int courseId)
        {
            var instructor = await GetInstructorAsync(userId);
            if (instructor is null)
                return OperationResult<List<InstructorSessionDto>>.Fail(OperationStatus.NotFound, "No instructor profile found for this account.");

            var course = await _repo.GetMyCourseAsync(instructor.Id, courseId);
            if (course is null)
                return OperationResult<List<InstructorSessionDto>>.Fail(OperationStatus.NotFound, "Course not found, or it isn't yours.");

            var sessions = await _repo.GetSessionsForCourseAsync(courseId);
            return OperationResult<List<InstructorSessionDto>>.Ok(sessions.Select(ToSessionDto).ToList());
        }

        public async Task<OperationResult<InstructorSessionDto>> CreateSessionAsync(int userId, int courseId, CreateSessionDto request)
        {
            var instructor = await GetInstructorAsync(userId);
            if (instructor is null)
                return OperationResult<InstructorSessionDto>.Fail(OperationStatus.NotFound, "No instructor profile found for this account.");

            var course = await _repo.GetMyCourseAsync(instructor.Id, courseId);
            if (course is null)
                return OperationResult<InstructorSessionDto>.Fail(OperationStatus.NotFound, "Course not found, or it isn't yours.");

            if (!TimeSpan.TryParse(request.StartTime, CultureInfo.InvariantCulture, out var start) ||
                !TimeSpan.TryParse(request.EndTime, CultureInfo.InvariantCulture, out var end))
                return OperationResult<InstructorSessionDto>.Fail(OperationStatus.BadRequest, "Enter the times like 09:30.");

            if (end <= start)
                return OperationResult<InstructorSessionDto>.Fail(OperationStatus.BadRequest, "The end time must be after the start time.");

            var session = new Session
            {
                CourseId = courseId,
                InstructorId = instructor.Id,
                // Date only, no time zone, so it reads back exactly as it was entered.
                SessionDate = DateTime.SpecifyKind(request.SessionDate!.Value.Date, DateTimeKind.Unspecified),
                StartTime = start,
                EndTime = end,
                Status = request.Status ?? "scheduled"
            };
            await _repo.AddSessionAsync(session);
            return OperationResult<InstructorSessionDto>.Ok(ToSessionDto(session));
        }

        // Every enrolled student with their mark for this session (null = not marked yet).
        public async Task<OperationResult<List<SessionAttendanceDto>>> GetSessionAttendanceAsync(int userId, int sessionId)
        {
            var instructor = await GetInstructorAsync(userId);
            if (instructor is null)
                return OperationResult<List<SessionAttendanceDto>>.Fail(OperationStatus.NotFound, "No instructor profile found for this account.");

            var session = await _repo.GetSessionForInstructorAsync(instructor.Id, sessionId);
            if (session is null)
                return OperationResult<List<SessionAttendanceDto>>.Fail(OperationStatus.NotFound, "Session not found, or it isn't yours.");

            var students = await _repo.GetEnrolledStudentsAsync(session.CourseId);
            var marks = (await _repo.GetAttendanceForSessionAsync(sessionId))
                .GroupBy(a => a.UserId)
                .ToDictionary(g => g.Key, g => g.First().Status);

            var result = students.Select(e => new SessionAttendanceDto
            {
                UserId = e.UserId,
                FirstName = e.User.FirstName,
                LastName = e.User.LastName,
                Status = marks.TryGetValue(e.UserId, out var status) ? status : null
            }).ToList();
            return OperationResult<List<SessionAttendanceDto>>.Ok(result);
        }

        public async Task<OperationResult<object>> MarkAttendanceAsync(int userId, int sessionId, MarkAttendanceDto request)
        {
            var instructor = await GetInstructorAsync(userId);
            if (instructor is null)
                return OperationResult<object>.Fail(OperationStatus.NotFound, "No instructor profile found for this account.");

            var session = await _repo.GetSessionForInstructorAsync(instructor.Id, sessionId);
            if (session is null)
                return OperationResult<object>.Fail(OperationStatus.NotFound, "Session not found, or it isn't yours.");

            var enrolledUserIds = (await _repo.GetEnrolledStudentsAsync(session.CourseId))
                .Select(enrollment => enrollment.UserId)
                .ToHashSet();
            if (request.Entries.Any(entry => !enrolledUserIds.Contains(entry.UserId)))
                return OperationResult<object>.Fail(
                    OperationStatus.BadRequest,
                    "Attendance can only be recorded for students enrolled in this course.");

            foreach (var entry in request.Entries)
                await _repo.UpsertAttendanceAsync(sessionId, entry.UserId, entry.Status);

            await _repo.SaveChangesAsync();
            return OperationResult<object>.Ok(new { message = $"Attendance saved for {request.Entries.Count} student(s)." });
        }

        // ---------------- Assignments ----------------

        public async Task<OperationResult<List<InstructorAssignmentDto>>> GetAssignmentsAsync(int userId, int courseId)
        {
            var instructor = await GetInstructorAsync(userId);
            if (instructor is null)
                return OperationResult<List<InstructorAssignmentDto>>.Fail(OperationStatus.NotFound, "No instructor profile found for this account.");

            var course = await _repo.GetMyCourseAsync(instructor.Id, courseId);
            if (course is null)
                return OperationResult<List<InstructorAssignmentDto>>.Fail(OperationStatus.NotFound, "Course not found, or it isn't yours.");

            var assignments = await _repo.GetAssignmentsForCourseAsync(courseId);
            var result = assignments.Select(a => new InstructorAssignmentDto
            {
                Id = a.Id,
                Title = a.Title,
                Description = a.Description,
                DueDate = a.DueDate,
                SubmissionCount = a.Submissions.Count
            }).ToList();
            return OperationResult<List<InstructorAssignmentDto>>.Ok(result);
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

        // ---------------- Admin: list of instructors (for the course form's instructor picker) ----------------

        public async Task<List<AdminInstructorDto>> GetAllInstructorsAsync()
        {
            var instructors = await _repo.GetAllInstructorsAsync();
            return instructors.Select(i => new AdminInstructorDto
            {
                InstructorId = i.Id,
                UserId = i.UserId,
                FirstName = i.User.FirstName,
                LastName = i.User.LastName,
                Email = i.User.Email,
                Specialization = i.Specialization
            }).ToList();
        }
    }
}