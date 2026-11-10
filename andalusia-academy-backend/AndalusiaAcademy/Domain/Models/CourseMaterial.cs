using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public class CourseMaterial
    {
        public int Id { get; set; }

        public int CourseId { get; set; }
        public Course Course { get; set; } = null!;

        public string Title { get; set; } = string.Empty;

        public string Type { get; set; } = "link"; // link | file

        public string Url { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}