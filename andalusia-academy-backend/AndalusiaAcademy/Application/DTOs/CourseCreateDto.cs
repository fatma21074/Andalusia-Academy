using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs
{
    public class CourseCreateDto
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
    }
}
