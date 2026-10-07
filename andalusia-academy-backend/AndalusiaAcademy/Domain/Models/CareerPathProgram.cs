using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class CareerPathProgram
    {
        public int CareerPathId { get; set; }
        public CareerPath CareerPath { get; set; } = null!;

        public int ProgramId { get; set; }
        public AcademyProgram Program { get; set; } = null!;
    }
}
