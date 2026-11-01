using System.ComponentModel.DataAnnotations;

namespace Application.DTOs
{
    // ---- Testimonials ----
    public class TestimonialDto
    {
        public int Id { get; set; }
        public string Quote { get; set; } = string.Empty;
        public string? DisplayRole { get; set; }
        public string AuthorName { get; set; } = string.Empty;
        public bool IsPublished { get; set; }
    }

    public class TestimonialCreateDto
    {
        [Range(1, int.MaxValue, ErrorMessage = "Author is required.")]
        public int UserId { get; set; }

        [Required(ErrorMessage = "Quote is required."), MaxLength(1000)]
        public string Quote { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? DisplayRole { get; set; }

        public bool IsPublished { get; set; } = true;
    }

    // ---- Partners ----
    public class PartnerDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string LogoUrl { get; set; } = string.Empty;
        public string? WebsiteUrl { get; set; }
        public bool IsPublished { get; set; }
    }

    public class PartnerCreateDto
    {
        [Required(ErrorMessage = "Name is required."), MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string LogoUrl { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? WebsiteUrl { get; set; }

        public bool IsPublished { get; set; } = true;
    }

    // ---- FAQs ----
    public class FaqDto
    {
        public int Id { get; set; }
        public string Question { get; set; } = string.Empty;
        public string Answer { get; set; } = string.Empty;
        public int DisplayOrder { get; set; }
        public bool IsPublished { get; set; }
    }

    public class FaqCreateDto
    {
        [Required(ErrorMessage = "Question is required."), MaxLength(500)]
        public string Question { get; set; } = string.Empty;

        [Required(ErrorMessage = "Answer is required."), MaxLength(4000)]
        public string Answer { get; set; } = string.Empty;

        [Range(0, 10000, ErrorMessage = "Display order must be between 0 and 10000.")]
        public int DisplayOrder { get; set; }

        public bool IsPublished { get; set; } = true;
    }
}