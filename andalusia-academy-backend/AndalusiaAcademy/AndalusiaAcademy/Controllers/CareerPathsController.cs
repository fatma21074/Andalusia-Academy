using Microsoft.AspNetCore.Mvc;
using Application.Services;
using Application.Common;

namespace AndalusiaAcademy.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CareerPathsController : ControllerBase
    {
        private readonly CareerPathService _service;
        public CareerPathsController(CareerPathService service) => _service = service;

        // GET /api/careerpaths?search=&page=&pageSize=
        [HttpGet]
        public async Task<ActionResult<PagedResult<Application.DTOs.CareerPathDto>>> GetAll([FromQuery] CareerPathFilterParams filter)
        {
            var result = await _service.GetAllAsync(filter);
            return Ok(result);
        }

        // GET /api/careerpaths/1
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Application.DTOs.CareerPathDetailDto>> GetById(int id)
        {
            var careerPath = await _service.GetByIdAsync(id);
            if (careerPath is null) return NotFound();
            return Ok(careerPath);
        }
    }
}