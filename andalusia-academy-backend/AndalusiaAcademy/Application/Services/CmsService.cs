using Domain.Models;
using Application.DTOs;
using Application.Common;
using Application.Repositories;

namespace Application.Services
{
    public class TestimonialService
    {
        private readonly ITestimonialRepository _repo;
        public TestimonialService(ITestimonialRepository repo) => _repo = repo;

        private static TestimonialDto ToDto(Testimonial t) => new()
        {
            Id = t.Id, Quote = t.Quote, DisplayRole = t.DisplayRole,
            AuthorName = $"{t.User.FirstName} {t.User.LastName}", IsPublished = t.IsPublished
        };

        public async Task<List<TestimonialDto>> GetPublishedAsync() =>
            (await _repo.GetPublishedAsync()).Select(ToDto).ToList();

        public async Task<List<TestimonialDto>> GetAllAsync() =>
            (await _repo.GetAllAsync()).Select(ToDto).ToList();

        public async Task<TestimonialDto> CreateAsync(TestimonialCreateDto request)
        {
            var testimonial = new Testimonial
            {
                UserId = request.UserId, Quote = request.Quote,
                DisplayRole = request.DisplayRole, IsPublished = request.IsPublished
            };
            await _repo.AddAsync(testimonial);
            var created = await _repo.GetByIdAsync(testimonial.Id);
            return ToDto(created!);
        }

        public async Task<OperationResult<object>> UpdateAsync(int id, TestimonialCreateDto request)
        {
            var updated = await _repo.UpdateAsync(id, t =>
            {
                t.Quote = request.Quote; t.DisplayRole = request.DisplayRole; t.IsPublished = request.IsPublished;
            });
            return updated
                ? OperationResult<object>.Ok(new { message = "Testimonial updated." })
                : OperationResult<object>.Fail(OperationStatus.NotFound, "Testimonial not found.");
        }

        public async Task<OperationResult<object>> DeleteAsync(int id) =>
            await _repo.DeleteAsync(id)
                ? OperationResult<object>.Ok(new { message = "Testimonial deleted." })
                : OperationResult<object>.Fail(OperationStatus.NotFound, "Testimonial not found.");
    }

    public class PartnerService
    {
        private readonly IPartnerRepository _repo;
        public PartnerService(IPartnerRepository repo) => _repo = repo;

        private static PartnerDto ToDto(Partner p) => new()
        {
            Id = p.Id, Name = p.Name, LogoUrl = p.LogoUrl, WebsiteUrl = p.WebsiteUrl, IsPublished = p.IsPublished
        };

        public async Task<List<PartnerDto>> GetPublishedAsync() =>
            (await _repo.GetPublishedAsync()).Select(ToDto).ToList();

        public async Task<List<PartnerDto>> GetAllAsync() =>
            (await _repo.GetAllAsync()).Select(ToDto).ToList();

        public async Task<PartnerDto> CreateAsync(PartnerCreateDto request)
        {
            var partner = new Partner
            {
                Name = request.Name, LogoUrl = request.LogoUrl,
                WebsiteUrl = request.WebsiteUrl, IsPublished = request.IsPublished
            };
            await _repo.AddAsync(partner);
            return ToDto(partner);
        }

        public async Task<OperationResult<object>> UpdateAsync(int id, PartnerCreateDto request)
        {
            var updated = await _repo.UpdateAsync(id, p =>
            {
                p.Name = request.Name; p.LogoUrl = request.LogoUrl;
                p.WebsiteUrl = request.WebsiteUrl; p.IsPublished = request.IsPublished;
            });
            return updated
                ? OperationResult<object>.Ok(new { message = "Partner updated." })
                : OperationResult<object>.Fail(OperationStatus.NotFound, "Partner not found.");
        }

        public async Task<OperationResult<object>> DeleteAsync(int id) =>
            await _repo.DeleteAsync(id)
                ? OperationResult<object>.Ok(new { message = "Partner deleted." })
                : OperationResult<object>.Fail(OperationStatus.NotFound, "Partner not found.");
    }

    public class FaqService
    {
        private readonly IFaqRepository _repo;
        public FaqService(IFaqRepository repo) => _repo = repo;

        private static FaqDto ToDto(Faq f) => new()
        {
            Id = f.Id, Question = f.Question, Answer = f.Answer,
            DisplayOrder = f.DisplayOrder, IsPublished = f.IsPublished
        };

        public async Task<List<FaqDto>> GetPublishedAsync() =>
            (await _repo.GetPublishedAsync()).Select(ToDto).ToList();

        public async Task<List<FaqDto>> GetAllAsync() =>
            (await _repo.GetAllAsync()).Select(ToDto).ToList();

        public async Task<FaqDto> CreateAsync(FaqCreateDto request)
        {
            var faq = new Faq
            {
                Question = request.Question, Answer = request.Answer,
                DisplayOrder = request.DisplayOrder, IsPublished = request.IsPublished
            };
            await _repo.AddAsync(faq);
            return ToDto(faq);
        }

        public async Task<OperationResult<object>> UpdateAsync(int id, FaqCreateDto request)
        {
            var updated = await _repo.UpdateAsync(id, f =>
            {
                f.Question = request.Question; f.Answer = request.Answer;
                f.DisplayOrder = request.DisplayOrder; f.IsPublished = request.IsPublished;
            });
            return updated
                ? OperationResult<object>.Ok(new { message = "FAQ updated." })
                : OperationResult<object>.Fail(OperationStatus.NotFound, "FAQ not found.");
        }

        public async Task<OperationResult<object>> DeleteAsync(int id) =>
            await _repo.DeleteAsync(id)
                ? OperationResult<object>.Ok(new { message = "FAQ deleted." })
                : OperationResult<object>.Fail(OperationStatus.NotFound, "FAQ not found.");
    }
}