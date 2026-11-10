using Microsoft.EntityFrameworkCore;
using Domain.Models;
using Application.Repositories;
using AndalusiaAcademy.Data;

namespace AndalusiaAcademy.Repositories
{
    public class TestimonialRepository : ITestimonialRepository
    {
        private readonly AppDbContext _context;
        public TestimonialRepository(AppDbContext context) => _context = context;

        public async Task<List<Testimonial>> GetPublishedAsync() =>
            await _context.Testimonials.Include(t => t.User).Where(t => t.IsPublished).ToListAsync();

        public async Task<List<Testimonial>> GetAllAsync() =>
            await _context.Testimonials.Include(t => t.User).ToListAsync();

        public async Task<Testimonial?> GetByIdAsync(int id) =>
            await _context.Testimonials.Include(t => t.User).FirstOrDefaultAsync(t => t.Id == id);

        public async Task AddAsync(Testimonial testimonial)
        {
            _context.Testimonials.Add(testimonial);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> UpdateAsync(int id, Action<Testimonial> apply)
        {
            var testimonial = await _context.Testimonials.FirstOrDefaultAsync(t => t.Id == id);
            if (testimonial is null) return false;
            apply(testimonial);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var testimonial = await _context.Testimonials.FirstOrDefaultAsync(t => t.Id == id);
            if (testimonial is null) return false;
            _context.Testimonials.Remove(testimonial);
            await _context.SaveChangesAsync();
            return true;
        }
    }

    public class PartnerRepository : IPartnerRepository
    {
        private readonly AppDbContext _context;
        public PartnerRepository(AppDbContext context) => _context = context;

        public async Task<List<Partner>> GetPublishedAsync() =>
            await _context.Partners.Where(p => p.IsPublished).ToListAsync();

        public async Task<List<Partner>> GetAllAsync() =>
            await _context.Partners.ToListAsync();

        public async Task<Partner?> GetByIdAsync(int id) =>
            await _context.Partners.FirstOrDefaultAsync(p => p.Id == id);

        public async Task AddAsync(Partner partner)
        {
            _context.Partners.Add(partner);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> UpdateAsync(int id, Action<Partner> apply)
        {
            var partner = await _context.Partners.FirstOrDefaultAsync(p => p.Id == id);
            if (partner is null) return false;
            apply(partner);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var partner = await _context.Partners.FirstOrDefaultAsync(p => p.Id == id);
            if (partner is null) return false;
            _context.Partners.Remove(partner);
            await _context.SaveChangesAsync();
            return true;
        }
    }

    public class FaqRepository : IFaqRepository
    {
        private readonly AppDbContext _context;
        public FaqRepository(AppDbContext context) => _context = context;

        public async Task<List<Faq>> GetPublishedAsync() =>
            await _context.Faqs.Where(f => f.IsPublished).OrderBy(f => f.DisplayOrder).ToListAsync();

        public async Task<List<Faq>> GetAllAsync() =>
            await _context.Faqs.OrderBy(f => f.DisplayOrder).ToListAsync();

        public async Task<Faq?> GetByIdAsync(int id) =>
            await _context.Faqs.FirstOrDefaultAsync(f => f.Id == id);

        public async Task AddAsync(Faq faq)
        {
            _context.Faqs.Add(faq);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> UpdateAsync(int id, Action<Faq> apply)
        {
            var faq = await _context.Faqs.FirstOrDefaultAsync(f => f.Id == id);
            if (faq is null) return false;
            apply(faq);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var faq = await _context.Faqs.FirstOrDefaultAsync(f => f.Id == id);
            if (faq is null) return false;
            _context.Faqs.Remove(faq);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}