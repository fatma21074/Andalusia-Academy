using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class AcademyProgram
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string? Overview { get; set; }

        public string? Requirements { get; set; }

        public string? Duration { get; set; }

        public string? Location { get; set; }

        public decimal Price { get; set; }

        public string Status { get; set; } = "draft";

        public ICollection<ProgramCourse> ProgramCourses { get; set; } = new List<ProgramCourse>();
        public ICollection<CareerPathProgram> CareerPathPrograms { get; set; } = new List<CareerPathProgram>();
        public ICollection<EnrollmentApplication> Applications { get; set; } = new List<EnrollmentApplication>();
    }
}
