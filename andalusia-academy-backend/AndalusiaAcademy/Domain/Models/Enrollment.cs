using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class Enrollment
    {
        public int Id { get; set; }
        public int ApplicationId { get; set; }
        public EnrollmentApplication Application { get; set; } = null!;
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public int CourseId { get; set; }
        public Course Course { get; set; } = null!;
        public string Status { get; set; } = "active"; // active | completed | withdrawn
        public DateTime EnrolledAt { get; set; } = DateTime.UtcNow;
    }
}
