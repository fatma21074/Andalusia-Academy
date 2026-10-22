using Microsoft.AspNetCore.Mvc;
using Application.Services;
using Application.Common;

namespace AndalusiaAcademy.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProgramsController : ControllerBase
    {
        private readonly ProgramService _service;
        public ProgramsController(ProgramService service) => _service = service;

        // GET /api/programs?search=&page=&pageSize=
        [HttpGet]
        public async Task<ActionResult<PagedResult<Application.DTOs.ProgramDto>>> GetAll([FromQuery] ProgramFilterParams filter)
        {
            var result = await _service.GetAllAsync(filter);
            return Ok(result);
        }

        // GET /api/programs/3
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Application.DTOs.ProgramDetailDto>> GetById(int id)
        {
            var program = await _service.GetByIdAsync(id);
            if (program is null) return NotFound();
            return Ok(program);
        }
    }
}