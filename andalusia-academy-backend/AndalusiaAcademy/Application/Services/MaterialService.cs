using Domain.Models;
using Application.DTOs;
using Application.Common;
using Application.Integrations;
using Application.Repositories;

namespace Application.Services
{
    public class MaterialService
    {
        private const long MaxFileBytes = 10 * 1024 * 1024; // 10 MB

        private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
        {
            ".pdf", ".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx", ".txt", ".zip", ".png", ".jpg", ".jpeg"
        };

        private readonly IInstructorRepository _repo;
        private readonly IFileStorage _storage;

        public MaterialService(IInstructorRepository repo, IFileStorage storage)
        {
            _repo = repo;
            _storage = storage;
        }

        private static InstructorMaterialDto ToDto(CourseMaterial m) => new()
        {
            Id = m.Id, Title = m.Title, Type = m.Type, Url = m.Url, CreatedAt = m.CreatedAt
        };

        // Returns the course only if it belongs to this instructor; null otherwise.
        private async Task<Course?> GetOwnedCourseAsync(int userId, int courseId)
        {
            var instructor = await _repo.GetInstructorByUserIdAsync(userId);
            if (instructor is null) return null;
            return await _repo.GetMyCourseAsync(instructor.Id, courseId);
        }

        public async Task<OperationResult<List<InstructorMaterialDto>>> ListAsync(int userId, int courseId)
        {
            if (await GetOwnedCourseAsync(userId, courseId) is null)
                return OperationResult<List<InstructorMaterialDto>>.Fail(OperationStatus.NotFound, "Course not found, or it isn't yours.");

            var materials = await _repo.GetMaterialsAsync(courseId);
            return OperationResult<List<InstructorMaterialDto>>.Ok(materials.Select(ToDto).ToList());
        }

        public async Task<OperationResult<InstructorMaterialDto>> AddLinkAsync(int userId, int courseId, AddLinkMaterialDto request)
        {
            if (await GetOwnedCourseAsync(userId, courseId) is null)
                return OperationResult<InstructorMaterialDto>.Fail(OperationStatus.NotFound, "Course not found, or it isn't yours.");

            var title = request.Title?.Trim() ?? string.Empty;
            if (title.Length == 0 || title.Length > 200)
                return OperationResult<InstructorMaterialDto>.Fail(OperationStatus.BadRequest, "Title is required (max 200 characters).");

            if (!Uri.TryCreate(request.Url, UriKind.Absolute, out var uri) ||
                (uri.Scheme != Uri.UriSchemeHttp && uri.Scheme != Uri.UriSchemeHttps))
                return OperationResult<InstructorMaterialDto>.Fail(OperationStatus.BadRequest, "Enter a valid link starting with http:// or https://.");

            var material = new CourseMaterial { CourseId = courseId, Title = title, Type = "link", Url = uri.ToString() };
            await _repo.AddMaterialAsync(material);
            return OperationResult<InstructorMaterialDto>.Ok(ToDto(material));
        }

        public async Task<OperationResult<InstructorMaterialDto>> AddFileAsync(
            int userId, int courseId, string? title, Stream content, string fileName, long length)
        {
            if (await GetOwnedCourseAsync(userId, courseId) is null)
                return OperationResult<InstructorMaterialDto>.Fail(OperationStatus.NotFound, "Course not found, or it isn't yours.");

            if (length <= 0)
                return OperationResult<InstructorMaterialDto>.Fail(OperationStatus.BadRequest, "The file is empty.");
            if (length > MaxFileBytes)
                return OperationResult<InstructorMaterialDto>.Fail(OperationStatus.BadRequest, "The file is too large (max 10 MB).");

            var extension = Path.GetExtension(fileName);
            if (!AllowedExtensions.Contains(extension))
                return OperationResult<InstructorMaterialDto>.Fail(OperationStatus.BadRequest,
                    $"This file type isn't allowed. Allowed: {string.Join(", ", AllowedExtensions.Order())}.");

            var finalTitle = string.IsNullOrWhiteSpace(title) ? Path.GetFileNameWithoutExtension(fileName) : title.Trim();
            if (finalTitle.Length > 200) finalTitle = finalTitle[..200];

            var url = await _storage.SaveAsync(content, fileName, "materials");

            var material = new CourseMaterial { CourseId = courseId, Title = finalTitle, Type = "file", Url = url };
            await _repo.AddMaterialAsync(material);
            return OperationResult<InstructorMaterialDto>.Ok(ToDto(material));
        }

        public async Task<OperationResult<object>> DeleteAsync(int userId, int materialId)
        {
            var instructor = await _repo.GetInstructorByUserIdAsync(userId);
            if (instructor is null)
                return OperationResult<object>.Fail(OperationStatus.NotFound, "No instructor profile found for this account.");

            var material = await _repo.GetMaterialForInstructorAsync(instructor.Id, materialId);
            if (material is null)
                return OperationResult<object>.Fail(OperationStatus.NotFound, "Material not found, or it isn't yours.");

            if (material.Type == "file") _storage.Delete(material.Url);
            await _repo.DeleteMaterialAsync(material);
            return OperationResult<object>.Ok(new { message = "Material deleted." });
        }
    }
}