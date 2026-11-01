using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Application.Services;
using Application.DTOs;
using Application.Common;

namespace AndalusiaAcademy.Controllers
{
    // multipart/form-data body for the file endpoint
    public class UploadMaterialForm
    {
        public IFormFile File { get; set; } = null!;
        public string? Title { get; set; }
    }

    [ApiController]
    [Route("api/instructor")]
    [Authorize(Roles = "Instructor")]
    public class InstructorMaterialsController : ControllerBase
    {
        private readonly MaterialService _service;
        public InstructorMaterialsController(MaterialService service) => _service = service;

        private int CurrentUserId =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        private ActionResult Handle<T>(OperationResult<T> result) => result.Status switch
        {
            OperationStatus.Success => Ok(result.Data),
            OperationStatus.NotFound => NotFound(new { message = result.Message }),
            OperationStatus.Conflict => Conflict(new { message = result.Message }),
            OperationStatus.BadRequest => BadRequest(new { message = result.Message }),
            _ => StatusCode(500)
        };

        // GET /api/instructor/courses/1/materials
        [HttpGet("courses/{courseId:int}/materials")]
        public async Task<IActionResult> List(int courseId) =>
            Handle(await _service.ListAsync(CurrentUserId, courseId));

        // POST /api/instructor/courses/1/materials/link   (JSON)
        [HttpPost("courses/{courseId:int}/materials/link")]
        public async Task<IActionResult> AddLink(int courseId, AddLinkMaterialDto request) =>
            Handle(await _service.AddLinkAsync(CurrentUserId, courseId, request));

        // POST /api/instructor/courses/1/materials/file   (multipart/form-data)
        [HttpPost("courses/{courseId:int}/materials/file")]
        [RequestSizeLimit(12 * 1024 * 1024)] // reject oversized bodies early; the service enforces the 10 MB file limit
        public async Task<IActionResult> UploadFile(int courseId, [FromForm] UploadMaterialForm form)
        {
            await using var stream = form.File.OpenReadStream();
            return Handle(await _service.AddFileAsync(
                CurrentUserId, courseId, form.Title, stream, form.File.FileName, form.File.Length));
        }

        // DELETE /api/instructor/materials/7
        [HttpDelete("materials/{materialId:int}")]
        public async Task<IActionResult> Delete(int materialId) =>
            Handle(await _service.DeleteAsync(CurrentUserId, materialId));
    }
}