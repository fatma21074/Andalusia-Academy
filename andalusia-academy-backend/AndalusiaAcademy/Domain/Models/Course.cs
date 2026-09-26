using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class Course
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string? ShortDescription { get; set; }

        public string? FullDescription { get; set; }

        public string? ImageUrl { get; set; }

        public string? Duration { get; set; }   // e.g. "8 weeks"

        public string? Schedule { get; set; }

        public string? Location { get; set; }   // offline courses only, per Phase 1 scope

        public decimal Price { get; set; }

        public string Status { get; set; } = "draft";  // draft | open | coming-soon | closed

        public string? Type { get; set; }              // e.g. "offline"

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // FKs
        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;

        public int InstructorId { get; set; }
        public Instructor Instructor { get; set; } = null!;

        // Navigation
        public ICollection<ProgramCourse> ProgramCourses { get; set; } = new List<ProgramCourse>();
        public ICollection<EnrollmentApplication> Applications { get; set; } = new List<EnrollmentApplication>();
        public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
        public ICollection<Session> Sessions { get; set; } = new List<Session>();
        public ICollection<Assignment> Assignments { get; set; } = new List<Assignment>();
    }
}
