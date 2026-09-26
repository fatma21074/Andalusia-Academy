using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class Attendance
    {
        public int Id { get; set; }
        public int SessionId { get; set; }
        public Session Session { get; set; } = null!;
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public string Status { get; set; } = "absent"; // present | late | absent | excused
    }
}
