using AutoMapper;
using Application.Common;
using Application.DTOs;
using Application.Repositories;

namespace Application.Services
{
    public class CareerPathService
    {
        private readonly ICareerPathRepository _repo;
        private readonly IMapper _mapper;

        public CareerPathService(ICareerPathRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<CareerPathDetailDto?> GetByIdAsync(int id)
        {
            var careerPath = await _repo.GetByIdAsync(id);
            if (careerPath is null) return null;

            var dto = _mapper.Map<CareerPathDetailDto>(careerPath);

            // Related programs — one per CareerPathProgram link
            var programs = careerPath.CareerPathPrograms
                .Select(cpp => cpp.Program)
                .Where(p => p.Status != CatalogStatus.Draft)
                .ToList();
            dto.RelatedPrograms = _mapper.Map<List<ProgramDto>>(programs);

            // Recommended courses — your chosen approach: derived from the
            // career path's programs, not a separate CareerPathCourse table.
            // Flatten every course from every linked program, then dedupe —
            // the same course can legitimately appear in more than one program.
            var courses = programs
                .SelectMany(p => p.ProgramCourses.Select(pc => pc.Course))
                .Where(c => c.Status != CatalogStatus.Draft)
                .DistinctBy(c => c.Id)
                .ToList();
            dto.RecommendedCourses = _mapper.Map<List<CourseDto>>(courses);

            return dto;
        }

        public async Task<PagedResult<CareerPathDto>> GetAllAsync(CareerPathFilterParams filter)
        {
            var paged = await _repo.GetAllAsync(filter);
            return new PagedResult<CareerPathDto>
            {
                Data = _mapper.Map<IEnumerable<CareerPathDto>>(paged.Data),
                Page = paged.Page,
                PageSize = paged.PageSize,
                TotalCount = paged.TotalCount
            };
        }
    }
}