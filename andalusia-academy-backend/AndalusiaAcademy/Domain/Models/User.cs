using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class User
    {
        public int Id { get; set; }

        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        // Never store plain text passwords - this holds the hashed value only.
        public string PasswordHash { get; set; } = string.Empty;

        public string? PhoneNumber { get; set; }

        public string? Country { get; set; }

        public string? PreferredLanguage { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // FK
        public int RoleId { get; set; }
        public Role Role { get; set; } = null!;

        // Navigation - one user MAY also be an instructor (1:1, optional)
        public Instructor? Instructor { get; set; }

        public ICollection<EnrollmentApplication> Applications { get; set; } = new List<EnrollmentApplication>();
        public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
        public ICollection<Attendance> AttendanceRecords { get; set; } = new List<Attendance>();
        public ICollection<Submission> Submissions { get; set; } = new List<Submission>();
        public ICollection<Testimonial> Testimonials { get; set; } = new List<Testimonial>();
    }
}
