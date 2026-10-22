using System.ComponentModel.DataAnnotations;

namespace Application.DTOs
{
    public class CourseUpdateDto
    {
        [Required, MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(300)]
        public string? ShortDescription { get; set; }

        public string? FullDescription { get; set; }

        [MaxLength(300)]
        public string? ImageUrl { get; set; }

        [MaxLength(100)]
        public string? Duration { get; set; }

        [MaxLength(200)]
        public string? Location { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Price cannot be negative.")]
        public decimal Price { get; set; }

        [Required]
        public int CategoryId { get; set; }

        [Required]
        public int InstructorId { get; set; }

        [Required]
        public string Status { get; set; } = "draft"; // draft | open | coming-soon | closed
    }

    public class AdminUserDto
    {
        public int UserId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}