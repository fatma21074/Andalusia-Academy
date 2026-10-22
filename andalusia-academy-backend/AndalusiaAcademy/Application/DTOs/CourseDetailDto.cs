namespace Application.DTOs
{
    public class CourseDetailDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? ShortDescription { get; set; }
        public string? FullDescription { get; set; }
        public string? ImageUrl { get; set; }
        public string? Duration { get; set; }
        public string? Schedule { get; set; }
        public string? Location { get; set; }
        public decimal Price { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Type { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public int InstructorId { get; set; }
        public string InstructorName { get; set; } = string.Empty;
    }
}