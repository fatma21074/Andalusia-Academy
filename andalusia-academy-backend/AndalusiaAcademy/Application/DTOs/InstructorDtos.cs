using System.ComponentModel.DataAnnotations;

namespace Application.DTOs
{
    public class InstructorCourseDto
    {
        public int CourseId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public int StudentCount { get; set; }
    }

    public class EnrolledStudentDto
    {
        public int UserId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime EnrolledAt { get; set; }
    }

    public class MarkAttendanceEntryDto
    {
        [Range(1, int.MaxValue, ErrorMessage = "Invalid student.")]
        public int UserId { get; set; }

        [Required(ErrorMessage = "Status is required."),
         RegularExpression("^(present|late|absent|excused)$", ErrorMessage = "Status must be present, late, absent or excused.")]
        public string Status { get; set; } = string.Empty;
    }

    public class MarkAttendanceDto
    {
        [MinLength(1, ErrorMessage = "Add at least one student.")]
        public List<MarkAttendanceEntryDto> Entries { get; set; } = new();
    }

    public class CreateAssignmentDto
    {
        [Required(ErrorMessage = "Title is required."), MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(4000)]
        public string? Description { get; set; }

        public DateTime? DueDate { get; set; }
    }

    public class SubmissionForInstructorDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public string? FileUrl { get; set; }
        public DateTime SubmittedAt { get; set; }
        public string Status { get; set; } = string.Empty;
        public int? Score { get; set; }
        public string? Feedback { get; set; }
    }

    public class GradeSubmissionDto
    {
        [Range(0, 100, ErrorMessage = "Score must be a whole number from 0 to 100.")]
        public int Score { get; set; }

        [MaxLength(2000)]
        public string? Feedback { get; set; }
    }

    // ---- Sessions ----
    public class InstructorSessionDto
    {
        public int Id { get; set; }
        public DateTime SessionDate { get; set; }
        public TimeSpan StartTime { get; set; }   // serialized as "09:30:00", same as the learner's session list
        public TimeSpan EndTime { get; set; }
        public string Status { get; set; } = string.Empty;
        public int MarkedCount { get; set; }      // students whose attendance is already marked
    }

    public class CreateSessionDto
    {
        [Required(ErrorMessage = "Date is required.")]
        public DateTime? SessionDate { get; set; }   // send a plain date: "2026-11-10"

        [Required(ErrorMessage = "Start time is required."),
         RegularExpression(@"^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$", ErrorMessage = "Use a time like 09:30.")]
        public string StartTime { get; set; } = string.Empty;

        [Required(ErrorMessage = "End time is required."),
         RegularExpression(@"^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$", ErrorMessage = "Use a time like 11:00.")]
        public string EndTime { get; set; } = string.Empty;

        [RegularExpression("^(scheduled|live|completed|cancelled)$", ErrorMessage = "Status must be scheduled, live, completed or cancelled.")]
        public string? Status { get; set; }          // optional, defaults to "scheduled"
    }

    public class SessionAttendanceDto
    {
        public int UserId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? Status { get; set; }          // null = not marked yet
    }

    // ---- Assignments list and admin instructor list ----
    public class InstructorAssignmentDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime? DueDate { get; set; }
        public int SubmissionCount { get; set; }
    }

    public class AdminInstructorDto
    {
        public int InstructorId { get; set; }        // Instructor.Id: what Course.InstructorId points at (NOT the user id)
        public int UserId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Specialization { get; set; }
    }
}