using Microsoft.EntityFrameworkCore;
using Domain.Models;
using Application.Repositories;
using AndalusiaAcademy.Data;

namespace AndalusiaAcademy.Repositories
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly AppDbContext _context;
        public PaymentRepository(AppDbContext context) => _context = context;

        public async Task<List<Payment>> GetByUserIdAsync(int userId)
        {
            return await _context.Payments
                .Include(p => p.Application)
                .Where(p => p.Application.UserId == userId)
                .OrderByDescending(p => p.Id)
                .ToListAsync();
        }

        public async Task<Payment?> GetBySessionIdAsync(string sessionId)
        {
            return await _context.Payments.FirstOrDefaultAsync(p => p.SessionId == sessionId);
        }

        public async Task AddAsync(Payment payment)
        {
            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();
        }
                public async Task<Payment?> GetByIdAsync(int id)
        {
            return await _context.Payments.FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
    }
}