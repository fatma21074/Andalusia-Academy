using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class Testimonial
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public string Quote { get; set; } = string.Empty;

        public string? DisplayRole { get; set; } // e.g. "Graduate, Full-Stack Track"

        public bool IsPublished { get; set; } = true;
    }
}
