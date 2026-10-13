using Domain.Models;
using Application.DTOs;
using Application.Common;
using Application.Repositories;

namespace Application.Services
{
    public class ApplicationService
    {
        private readonly IApplicationRepository _appRepo;
        private readonly ICourseRepository _courseRepo;
        private readonly IProgramRepository _programRepo;

        public ApplicationService(
            IApplicationRepository appRepo,
            ICourseRepository courseRepo,
            IProgramRepository programRepo)
        {
            _appRepo = appRepo;
            _courseRepo = courseRepo;
            _programRepo = programRepo;
        }

        public async Task<OperationResult<ApplicationDto>> CreateAsync(int userId, CreateApplicationDto request)
        {
            bool hasCourse = request.CourseId.HasValue;
            bool hasProgram = request.ProgramId.HasValue;

            if (hasCourse == hasProgram) // both set, or neither set
                return OperationResult<ApplicationDto>.Fail(OperationStatus.BadRequest,
                    "Provide exactly one of courseId or programId.");

            decimal amount;
            string? courseTitle = null, programTitle = null;

            if (hasCourse)
            {
                var course = await _courseRepo.GetByIdAsync(request.CourseId!.Value);
                if (course is null)
                    return OperationResult<ApplicationDto>.Fail(OperationStatus.NotFound, "Course not found.");
                amount = course.Price;
                courseTitle = course.Title;
            }
            else
            {
                var program = await _programRepo.GetByIdAsync(request.ProgramId!.Value);
                if (program is null)
                    return OperationResult<ApplicationDto>.Fail(OperationStatus.NotFound, "Program not found.");
                amount = program.Price;
                programTitle = program.Title;
            }

            if (await _appRepo.HasActiveApplicationAsync(userId, request.CourseId, request.ProgramId))
                return OperationResult<ApplicationDto>.Fail(OperationStatus.Conflict,
                    "You already have a pending or approved application for this.");

            var application = new EnrollmentApplication
            {
                UserId = userId,
                CourseId = request.CourseId,
                ProgramId = request.ProgramId,
                Status = "pending"
            };
            await _appRepo.AddAsync(application);

            return OperationResult<ApplicationDto>.Ok(new ApplicationDto
            {
                Id = application.Id,
                CourseId = application.CourseId,
                CourseTitle = courseTitle,
                ProgramId = application.ProgramId,
                ProgramTitle = programTitle,
                Status = application.Status,
                AppliedAt = application.AppliedAt,
                Amount = amount
            });
        }

        public async Task<List<ApplicationDto>> GetMyApplicationsAsync(int userId)
        {
            var applications = await _appRepo.GetByUserIdAsync(userId);
            return applications.Select(a => new ApplicationDto
            {
                Id = a.Id,
                CourseId = a.CourseId,
                CourseTitle = a.Course?.Title,
                ProgramId = a.ProgramId,
                ProgramTitle = a.Program?.Title,
                Status = a.Status,
                AppliedAt = a.AppliedAt,
                Amount = a.Course?.Price ?? a.Program?.Price ?? 0
            }).ToList();
        }
    }
}