using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class Submission
    {
        public int Id { get; set; }

        public int AssignmentId { get; set; }
        public Assignment Assignment { get; set; } = null!;

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public string? FileUrl { get; set; }

        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;

        public int? Score { get; set; }

        public string? Feedback { get; set; }

        public string Status { get; set; } = "submitted"; // submitted | graded
    }
}
