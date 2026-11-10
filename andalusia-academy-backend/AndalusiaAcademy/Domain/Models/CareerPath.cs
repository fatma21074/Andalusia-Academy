using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class CareerPath
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public string? RecommendedSkills { get; set; }

        public ICollection<CareerPathProgram> CareerPathPrograms { get; set; } = new List<CareerPathProgram>();
    }
}
