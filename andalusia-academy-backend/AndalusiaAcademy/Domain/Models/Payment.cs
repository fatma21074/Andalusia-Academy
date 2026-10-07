using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class Payment
    {
        public int Id { get; set; }

        public int ApplicationId { get; set; }
        public EnrollmentApplication Application { get; set; } = null!;

        public decimal Amount { get; set; }

        public string Status { get; set; } = "pending"; // pending | paid | failed

        public string? Method { get; set; }             // gateway or agreed simulation

        public DateTime? PaidAt { get; set; }
    }
}
