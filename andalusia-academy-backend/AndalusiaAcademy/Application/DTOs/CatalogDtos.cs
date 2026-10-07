using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs
{
    public class ProgramDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Overview { get; set; }
        public decimal Price { get; set; }
        public string Status { get; set; } = string.Empty;
        public int CourseCount { get; set; }
    }

    public class CareerPathDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? RecommendedSkills { get; set; }
    }

    public class CategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }
        public class ProgramDetailDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Overview { get; set; }
        public string? Requirements { get; set; }
        public string? Duration { get; set; }
        public string? Location { get; set; }
        public decimal Price { get; set; }
        public string Status { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public List<CourseDto> IncludedCourses { get; set; } = new();
    }

    public class CareerPathDetailDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? RecommendedSkills { get; set; }
        public List<ProgramDto> RelatedPrograms { get; set; } = new();
        public List<CourseDto> RecommendedCourses { get; set; } = new();
    }
}
