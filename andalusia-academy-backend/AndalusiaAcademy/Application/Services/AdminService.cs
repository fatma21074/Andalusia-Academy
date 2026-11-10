using AutoMapper;
using Domain.Models;
using Application.DTOs;
using Application.Common;
using Application.Repositories;

namespace Application.Services
{
    public class AdminService
    {
        private readonly ICourseRepository _courseRepo;
        private readonly IUserRepository _userRepo;
        private readonly IMapper _mapper;

        public AdminService(ICourseRepository courseRepo, IUserRepository userRepo, IMapper mapper)
        {
            _courseRepo = courseRepo;
            _userRepo = userRepo;
            _mapper = mapper;
        }

        public async Task<List<AdminUserDto>> GetAllUsersAsync()
        {
            var users = await _userRepo.GetAllUsersAsync();
            return users.Select(u => new AdminUserDto
            {
                UserId = u.Id, FirstName = u.FirstName, LastName = u.LastName,
                Email = u.Email, Role = u.Role.Name, CreatedAt = u.CreatedAt
            }).ToList();
        }

        public async Task<CourseDetailDto> CreateCourseAsync(CourseCreateDto request)
        {
            var course = new Course
            {
                Title = request.Title,
                ShortDescription = request.ShortDescription,
                FullDescription = request.FullDescription,
                ImageUrl = request.ImageUrl,
                Duration = request.Duration,
                Location = request.Location,
                Price = request.Price,
                CategoryId = request.CategoryId,
                InstructorId = request.InstructorId,
                Status = "draft"
            };
            await _courseRepo.AddAsync(course);

            var created = await _courseRepo.GetByIdAsync(course.Id);
            return _mapper.Map<CourseDetailDto>(created);
        }

        public async Task<OperationResult<object>> UpdateCourseAsync(int courseId, CourseUpdateDto request)
        {
            var updated = await _courseRepo.UpdateAsync(courseId, course =>
            {
                course.Title = request.Title;
                course.ShortDescription = request.ShortDescription;
                course.FullDescription = request.FullDescription;
                course.ImageUrl = request.ImageUrl;
                course.Duration = request.Duration;
                course.Location = request.Location;
                course.Price = request.Price;
                course.CategoryId = request.CategoryId;
                course.InstructorId = request.InstructorId;
                course.Status = request.Status;
            });

            if (!updated)
                return OperationResult<object>.Fail(OperationStatus.NotFound, "Course not found.");
            return OperationResult<object>.Ok(new { message = "Course updated." });
        }

        public async Task<OperationResult<object>> DeleteCourseAsync(int courseId)
        {
            var deleted = await _courseRepo.DeleteAsync(courseId);
            if (!deleted)
                return OperationResult<object>.Fail(OperationStatus.NotFound, "Course not found.");
            return OperationResult<object>.Ok(new { message = "Course deleted." });
        }
    }
}