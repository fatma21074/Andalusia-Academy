using AutoMapper;
using Application.Common;
using Application.DTOs;
using Application.Repositories;

namespace Application.Services
{
    public class ProgramService
    {
        private readonly IProgramRepository _repo;
        private readonly IMapper _mapper;

        public ProgramService(IProgramRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<ProgramDetailDto?> GetByIdAsync(int id)
        {
            var program = await _repo.GetByIdAsync(id);
            return program is null ? null : _mapper.Map<ProgramDetailDto>(program);
        }

        public async Task<PagedResult<ProgramDto>> GetAllAsync(ProgramFilterParams filter)
        {
            var paged = await _repo.GetAllAsync(filter);
            return new PagedResult<ProgramDto>
            {
                Data = _mapper.Map<IEnumerable<ProgramDto>>(paged.Data),
                Page = paged.Page,
                PageSize = paged.PageSize,
                TotalCount = paged.TotalCount
            };
        }
    }
}