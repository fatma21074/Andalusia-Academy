using AutoMapper;
using Application.Common;
using Application.DTOs;
using Application.Repositories;

namespace Application.Services
{
    public class CourseService
    {
        private readonly ICourseRepository _repo;
        private readonly IMapper _mapper;

        public CourseService(ICourseRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<CourseDetailDto?> GetByIdAsync(int id)
        {
            var course = await _repo.GetByIdAsync(id);
            return course is null ? null : _mapper.Map<CourseDetailDto>(course);
        }

        public async Task<PagedResult<CourseDto>> GetAllAsync(CourseFilterParams filter)
        {
            var paged = await _repo.GetAllAsync(filter);
            return new PagedResult<CourseDto>
            {
                Data = _mapper.Map<IEnumerable<CourseDto>>(paged.Data),
                Page = paged.Page,
                PageSize = paged.PageSize,
                TotalCount = paged.TotalCount
            };
        }
    }
}