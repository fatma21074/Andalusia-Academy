using Domain.Models;
using Application.DTOs;
using Application.Common;
using Application.Repositories;

namespace Application.Services
{
    public class LearnerService
    {
        private readonly ILearnerRepository _repo;

        public LearnerService(ILearnerRepository repo) => _repo = repo;

        public async Task<List<MyCourseDto>> GetMyCoursesAsync(int userId)
        {
            var enrollments = await _repo.GetMyEnrollmentsAsync(userId);
            var result = new List<MyCourseDto>();

            foreach (var e in enrollments)
            {
                result.Add(new MyCourseDto
                {
                    CourseId = e.CourseId,
                    Title = e.Course.Title,
                    Status = e.Status,
                    EnrolledAt = e.EnrolledAt,
                    ProgressPercent = await CalculateProgressAsync(userId, e.CourseId)
                });
            }
            return result;
        }

        public async Task<OperationResult<CourseLearningDto>> GetCourseLearningAsync(int userId, int courseId)
        {
            // enrollment check first — never leak course content to someone not enrolled
            var enrollment = await _repo.GetEnrollmentAsync(userId, courseId);
            if (enrollment is null)
                return OperationResult<CourseLearningDto>.Fail(OperationStatus.NotFound, "You're not enrolled in this course.");

            var course = await _repo.GetCourseWithLearningDataAsync(courseId);
            if (course is null)
                return OperationResult<CourseLearningDto>.Fail(OperationStatus.NotFound, "Course not found.");

            var myAttendance = await _repo.GetMyAttendanceAsync(userId, courseId);
            var mySubmissions = await _repo.GetMySubmissionsAsync(userId, courseId);

            var sessionDtos = course.Sessions.Select(s =>
            {
                var attendance = myAttendance.FirstOrDefault(a => a.SessionId == s.Id);
                return new SessionDto
                {
                    Id = s.Id,
                    SessionDate = s.SessionDate,
                    StartTime = s.StartTime,
                    EndTime = s.EndTime,
                    Status = s.Status,
                    MyAttendanceStatus = attendance?.Status
                };
            }).OrderBy(s => s.SessionDate).ToList();

            var assignmentDtos = course.Assignments.Select(a =>
            {
                var submission = mySubmissions.FirstOrDefault(s => s.AssignmentId == a.Id);
                return new AssignmentDto
                {
                    Id = a.Id,
                    Title = a.Title,
                    Description = a.Description,
                    DueDate = a.DueDate,
                    MySubmissionStatus = submission?.Status,
                    MyScore = submission?.Score
                };
            }).ToList();

            return OperationResult<CourseLearningDto>.Ok(new CourseLearningDto
            {
                CourseId = course.Id,
                Title = course.Title,
                Location = course.Location,
                Schedule = course.Schedule,
                InstructorName = $"{course.Instructor.User.FirstName} {course.Instructor.User.LastName}",
                Materials = course.Materials.Select(m => new CourseMaterialDto
                {
                    Id = m.Id, Title = m.Title, Type = m.Type, Url = m.Url
                }).ToList(),
                Sessions = sessionDtos,
                Assignments = assignmentDtos,
                ProgressPercent = CalculateProgress(course.Sessions.Count, myAttendance.Count(a => a.Status == "present"),
                                                      course.Assignments.Count, mySubmissions.Count)
            });
        }

        public async Task<OperationResult<object>> SubmitAssignmentAsync(int userId, int assignmentId, SubmitAssignmentDto request)
        {
            var assignment = await _repo.GetAssignmentAsync(assignmentId);
            if (assignment is null)
                return OperationResult<object>.Fail(OperationStatus.NotFound, "Assignment not found.");

            var enrollment = await _repo.GetEnrollmentAsync(userId, assignment.CourseId);
            if (enrollment is null)
                return OperationResult<object>.Fail(OperationStatus.NotFound, "You're not enrolled in this course.");

            var existing = await _repo.GetMySubmissionForAssignmentAsync(userId, assignmentId);
            if (existing is not null)
                return OperationResult<object>.Fail(OperationStatus.Conflict, "You've already submitted this assignment.");

            await _repo.AddSubmissionAsync(new Submission
            {
                AssignmentId = assignmentId,
                UserId = userId,
                FileUrl = request.FileUrl,
                Status = "submitted"
            });

            return OperationResult<object>.Ok(new { message = "Submitted." });
        }

        // ---- Progress calculation ----
        // No Progress table exists — it's computed from how much of the course has actually happened.
        private async Task<int> CalculateProgressAsync(int userId, int courseId)
        {
            var course = await _repo.GetCourseWithLearningDataAsync(courseId);
            if (course is null) return 0;
            var attendance = await _repo.GetMyAttendanceAsync(userId, courseId);
            var submissions = await _repo.GetMySubmissionsAsync(userId, courseId);
            return CalculateProgress(course.Sessions.Count, attendance.Count(a => a.Status == "present"),
                                       course.Assignments.Count, submissions.Count);
        }

        private static int CalculateProgress(int totalSessions, int attendedSessions, int totalAssignments, int submittedAssignments)
        {
            // Half the grade is showing up, half is doing the work. Split evenly; each half maxes at 50%.
            int sessionPart = totalSessions == 0 ? 50 : (int)(50.0 * attendedSessions / totalSessions);
            int assignmentPart = totalAssignments == 0 ? 50 : (int)(50.0 * submittedAssignments / totalAssignments);
            return Math.Min(100, sessionPart + assignmentPart);
        }
    }
}