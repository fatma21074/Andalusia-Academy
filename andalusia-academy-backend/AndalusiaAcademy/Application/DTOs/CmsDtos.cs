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
        public int UserId { get; set; }
        public string Quote { get; set; } = string.Empty;
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
        public string Name { get; set; } = string.Empty;
        public string LogoUrl { get; set; } = string.Empty;
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
        public string Question { get; set; } = string.Empty;
        public string Answer { get; set; } = string.Empty;
        public int DisplayOrder { get; set; }
        public bool IsPublished { get; set; } = true;
    }
}