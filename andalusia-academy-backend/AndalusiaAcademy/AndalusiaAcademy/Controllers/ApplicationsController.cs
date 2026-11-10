using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Application.Services;
using Application.DTOs;
using Application.Common;

namespace AndalusiaAcademy.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ApplicationsController : ControllerBase
    {
        private readonly ApplicationService _service;
        public ApplicationsController(ApplicationService service) => _service = service;

        private int CurrentUserId =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // POST /api/applications
        [HttpPost]
        public async Task<ActionResult<ApplicationDto>> Create(CreateApplicationDto request)
        {
            var result = await _service.CreateAsync(CurrentUserId, request);
            return result.Status switch
            {
                OperationStatus.Success => Ok(result.Data),
                OperationStatus.BadRequest => BadRequest(new { message = result.Message }),
                OperationStatus.NotFound => NotFound(new { message = result.Message }),
                OperationStatus.Conflict => Conflict(new { message = result.Message }),
                _ => StatusCode(500)
            };
        }

        // GET /api/applications/my
        [HttpGet("my")]
        public async Task<ActionResult<List<ApplicationDto>>> GetMy()
        {
            var applications = await _service.GetMyApplicationsAsync(CurrentUserId);
            return Ok(applications);
        }
    }
}