using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Application.Services;
using Application.DTOs;
using Application.Common;

namespace AndalusiaAcademy.Controllers
{
    [ApiController]
    [Route("api/instructor")]
    [Authorize(Roles = "Instructor")]
    public class InstructorController : ControllerBase
    {
        private readonly InstructorService _service;
        public InstructorController(InstructorService service) => _service = service;

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

        [HttpGet("my-courses")]
        public async Task<IActionResult> MyCourses() =>
            Handle(await _service.GetMyCoursesAsync(CurrentUserId));

        [HttpGet("courses/{courseId:int}/students")]
        public async Task<IActionResult> Students(int courseId) =>
            Handle(await _service.GetStudentsAsync(CurrentUserId, courseId));

        [HttpPost("sessions/{sessionId:int}/attendance")]
        public async Task<IActionResult> MarkAttendance(int sessionId, MarkAttendanceDto request) =>
            Handle(await _service.MarkAttendanceAsync(CurrentUserId, sessionId, request));

        [HttpPost("courses/{courseId:int}/assignments")]
        public async Task<IActionResult> CreateAssignment(int courseId, CreateAssignmentDto request) =>
            Handle(await _service.CreateAssignmentAsync(CurrentUserId, courseId, request));

        [HttpGet("assignments/{assignmentId:int}/submissions")]
        public async Task<IActionResult> Submissions(int assignmentId) =>
            Handle(await _service.GetSubmissionsAsync(CurrentUserId, assignmentId));

        [HttpPost("submissions/{submissionId:int}/grade")]
        public async Task<IActionResult> GradeSubmission(int submissionId, GradeSubmissionDto request) =>
            Handle(await _service.GradeSubmissionAsync(CurrentUserId, submissionId, request));
    }
}