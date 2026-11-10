using Domain.Models;

namespace Application.Repositories
{
    public interface ITestimonialRepository
    {
        Task<List<Testimonial>> GetPublishedAsync();
        Task<List<Testimonial>> GetAllAsync(); // Admin view — published and unpublished
        Task<Testimonial?> GetByIdAsync(int id);
        Task AddAsync(Testimonial testimonial);
        Task<bool> UpdateAsync(int id, Action<Testimonial> apply);
        Task<bool> DeleteAsync(int id);
    }

    public interface IPartnerRepository
    {
        Task<List<Partner>> GetPublishedAsync();
        Task<List<Partner>> GetAllAsync();
        Task<Partner?> GetByIdAsync(int id);
        Task AddAsync(Partner partner);
        Task<bool> UpdateAsync(int id, Action<Partner> apply);
        Task<bool> DeleteAsync(int id);
    }

    public interface IFaqRepository
    {
        Task<List<Faq>> GetPublishedAsync();
        Task<List<Faq>> GetAllAsync();
        Task<Faq?> GetByIdAsync(int id);
        Task AddAsync(Faq faq);
        Task<bool> UpdateAsync(int id, Action<Faq> apply);
        Task<bool> DeleteAsync(int id);
    }
}