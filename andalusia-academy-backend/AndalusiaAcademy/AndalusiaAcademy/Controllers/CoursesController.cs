using Microsoft.AspNetCore.Mvc;
using Application.Services;
using Application.Common;

namespace AndalusiaAcademy.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CoursesController : ControllerBase
    {
        private readonly CourseService _service;
        public CoursesController(CourseService service) => _service = service;

        // GET /api/courses?search=&categoryId=&status=&sortBy=&order=&page=&pageSize=
        [HttpGet]
        public async Task<ActionResult<PagedResult<Application.DTOs.CourseDto>>> GetAll([FromQuery] CourseFilterParams filter)
        {
            var result = await _service.GetAllAsync(filter);
            return Ok(result);
        }

        // GET /api/courses/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Application.DTOs.CourseDetailDto>> GetById(int id)
        {
            var course = await _service.GetByIdAsync(id);
            if (course is null) return NotFound();
            return Ok(course);
        }
    }
}