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
}