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
        public int UserId { get; set; }
        public string Status { get; set; } = string.Empty; // present | late | absent | excused
    }

    public class MarkAttendanceDto
    {
        public List<MarkAttendanceEntryDto> Entries { get; set; } = new();
    }

    public class CreateAssignmentDto
    {
        public string Title { get; set; } = string.Empty;
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
        public int Score { get; set; }
        public string? Feedback { get; set; }
    }
}