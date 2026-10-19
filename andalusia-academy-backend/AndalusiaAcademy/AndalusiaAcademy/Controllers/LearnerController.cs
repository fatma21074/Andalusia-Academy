using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Application.Services;
using Application.DTOs;
using Application.Common;

namespace AndalusiaAcademy.Controllers
{
    [ApiController]
    [Route("api/learner")]
    [Authorize]
    public class LearnerController : ControllerBase
    {
        private readonly LearnerService _service;
        public LearnerController(LearnerService service) => _service = service;

        private int CurrentUserId =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // GET /api/learner/my-courses
        [HttpGet("my-courses")]
        public async Task<ActionResult<List<MyCourseDto>>> MyCourses()
        {
            return Ok(await _service.GetMyCoursesAsync(CurrentUserId));
        }

        // GET /api/learner/courses/5
        [HttpGet("courses/{courseId:int}")]
        public async Task<ActionResult<CourseLearningDto>> CourseLearning(int courseId)
        {
            var result = await _service.GetCourseLearningAsync(CurrentUserId, courseId);
            return result.Status switch
            {
                OperationStatus.Success => Ok(result.Data),
                OperationStatus.NotFound => NotFound(new { message = result.Message }),
                _ => StatusCode(500)
            };
        }

        // POST /api/learner/assignments/12/submit
        [HttpPost("assignments/{assignmentId:int}/submit")]
        public async Task<IActionResult> SubmitAssignment(int assignmentId, SubmitAssignmentDto request)
        {
            var result = await _service.SubmitAssignmentAsync(CurrentUserId, assignmentId, request);
            return result.Status switch
            {
                OperationStatus.Success => Ok(result.Data),
                OperationStatus.NotFound => NotFound(new { message = result.Message }),
                OperationStatus.Conflict => Conflict(new { message = result.Message }),
                _ => StatusCode(500)
            };
        }
    }
}