using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class Instructor
    {
        public int Id { get; set; }

        // FK + 1:1 link back to the account
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public string? Specialization { get; set; }

        public string? Bio { get; set; }

        public decimal? RatePerHour { get; set; }

        public ICollection<Course> Courses { get; set; } = new List<Course>();
        public ICollection<Session> Sessions { get; set; } = new List<Session>();
    }
}
