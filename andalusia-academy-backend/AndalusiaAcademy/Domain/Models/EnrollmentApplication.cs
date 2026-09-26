using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class EnrollmentApplication
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        // An application targets EITHER a course OR a program - keep both
        // nullable and enforce "exactly one is set" in application logic
        // (a CHECK constraint can be added later via migration if needed).
        public int? CourseId { get; set; }
        public Course? Course { get; set; }

        public int? ProgramId { get; set; }
        public AcademyProgram? Program { get; set; }

        public string Status { get; set; } = "pending"; // pending | approved | rejected

        public DateTime AppliedAt { get; set; } = DateTime.UtcNow;

        public Payment? Payment { get; set; }
        public Enrollment? Enrollment { get; set; }
    }
}
