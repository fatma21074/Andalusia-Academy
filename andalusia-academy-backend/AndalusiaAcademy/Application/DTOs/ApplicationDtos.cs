namespace Application.DTOs
{
    public class CreateApplicationDto
    {
        public int? CourseId { get; set; }
        public int? ProgramId { get; set; }
    }

    public class ApplicationDto
    {
        public int Id { get; set; }
        public int? CourseId { get; set; }
        public string? CourseTitle { get; set; }
        public int? ProgramId { get; set; }
        public string? ProgramTitle { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime AppliedAt { get; set; }
        public decimal Amount { get; set; }
    }
}