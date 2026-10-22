namespace Application.DTOs
{
    public class MyCourseDto
    {
        public int CourseId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;       // the Enrollment's status
        public DateTime EnrolledAt { get; set; }
        public int ProgressPercent { get; set; }
    }

    public class CourseMaterialDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
    }

    public class SessionDto
    {
        public int Id { get; set; }
        public DateTime SessionDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? MyAttendanceStatus { get; set; }   // null if this session hasn't happened for me yet
    }

    public class AssignmentDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime? DueDate { get; set; }
        public string? MySubmissionStatus { get; set; }    // null | "submitted" | "graded"
        public int? MyScore { get; set; }
    }

    public class CourseLearningDto
    {
        public int CourseId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Location { get; set; }
        public string? Schedule { get; set; }
        public string InstructorName { get; set; } = string.Empty;
        public List<CourseMaterialDto> Materials { get; set; } = new();
        public List<SessionDto> Sessions { get; set; } = new();
        public List<AssignmentDto> Assignments { get; set; } = new();
        public int ProgressPercent { get; set; }
    }

    public class SubmitAssignmentDto
    {
        public string? FileUrl { get; set; }
    }
}