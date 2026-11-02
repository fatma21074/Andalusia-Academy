using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Application.Services;
using Application.DTOs;

namespace AndalusiaAcademy.Controllers
{
    [ApiController]
    [Route("api/admin/instructors")]
    [Authorize(Roles = "Admin")]
    public class AdminInstructorsController : ControllerBase
    {
        private readonly InstructorService _service;
        public AdminInstructorsController(InstructorService service) => _service = service;

        // GET /api/admin/instructors: for the instructor picker in the course form.
        // instructorId is Instructor.Id (what Course.InstructorId points at), not the user id.
        [HttpGet]
        public async Task<ActionResult<List<AdminInstructorDto>>> GetAll() =>
            Ok(await _service.GetAllInstructorsAsync());
    }
}