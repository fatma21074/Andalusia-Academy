using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Application.Services;
using Application.DTOs;
using Application.Common;

namespace AndalusiaAcademy.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly AdminService _service;
        public AdminController(AdminService service) => _service = service;

        [HttpGet("users")]
        public async Task<ActionResult<List<AdminUserDto>>> GetUsers() =>
            Ok(await _service.GetAllUsersAsync());

        [HttpPost("courses")]
        public async Task<ActionResult<CourseDetailDto>> CreateCourse(CourseCreateDto request)
        {
            var created = await _service.CreateCourseAsync(request);
            return Ok(created);
        }

        [HttpPut("courses/{id:int}")]
        public async Task<IActionResult> UpdateCourse(int id, CourseUpdateDto request)
        {
            var result = await _service.UpdateCourseAsync(id, request);
            return result.Status == OperationStatus.Success
                ? Ok(result.Data)
                : NotFound(new { message = result.Message });
        }

        [HttpDelete("courses/{id:int}")]
        public async Task<IActionResult> DeleteCourse(int id)
        {
            var result = await _service.DeleteCourseAsync(id);
            return result.Status == OperationStatus.Success
                ? Ok(result.Data)
                : NotFound(new { message = result.Message });
        }
    }
}