using Domain.Models;
using Application.DTOs;
using Application.Common;
using Application.Repositories;

namespace Application.Services
{
    public class PaymentService
    {
        private readonly IApplicationRepository _appRepo;
        private readonly IPaymentRepository _paymentRepo;
        private readonly IEnrollmentRepository _enrollmentRepo;
        private readonly IProgramRepository _programRepo;

        public PaymentService(
            IApplicationRepository appRepo,
            IPaymentRepository paymentRepo,
            IEnrollmentRepository enrollmentRepo,
            IProgramRepository programRepo)
        {
            _appRepo = appRepo;
            _paymentRepo = paymentRepo;
            _enrollmentRepo = enrollmentRepo;
            _programRepo = programRepo;
        }

        public async Task<OperationResult<PaymentDto>> PayAsync(int userId, CreatePaymentDto request)
        {
            var application = await _appRepo.GetByIdAsync(request.ApplicationId);
            if (application is null || application.UserId != userId)
                return OperationResult<PaymentDto>.Fail(OperationStatus.NotFound, "Application not found.");

            if (application.Payment is not null)
                return OperationResult<PaymentDto>.Fail(OperationStatus.Conflict, "This application has already been paid.");

            decimal amount = application.Course?.Price ?? application.Program?.Price
                ?? throw new InvalidOperationException("Application has neither a course nor a program.");

            // Self-service simulation: payment succeeds immediately, no gateway round-trip.
            var payment = new Payment
            {
                ApplicationId = application.Id,
                Amount = amount,
                Status = "paid",
                Method = request.Method,
                PaidAt = DateTime.UtcNow
            };

            application.Status = "approved"; // tracked by EF Core — saved below, same DbContext

            var newEnrollments = new List<Enrollment>();

            if (application.CourseId.HasValue)
            {
                if (!await _enrollmentRepo.ExistsAsync(userId, application.CourseId.Value))
                {
                    newEnrollments.Add(new Enrollment
                    {
                        ApplicationId = application.Id,
                        UserId = userId,
                        CourseId = application.CourseId.Value,
                        Status = "active"
                    });
                }
            }
            else if (application.ProgramId.HasValue)
            {
                var program = await _programRepo.GetByIdAsync(application.ProgramId.Value);
                foreach (var pc in program!.ProgramCourses)
                {
                    if (!await _enrollmentRepo.ExistsAsync(userId, pc.CourseId))
                    {
                        newEnrollments.Add(new Enrollment
                        {
                            ApplicationId = application.Id,
                            UserId = userId,
                            CourseId = pc.CourseId,
                            Status = "active"
                        });
                    }
                }
            }

            await _paymentRepo.AddAsync(payment);       // also persists application.Status (same tracked DbContext)
            if (newEnrollments.Count > 0)
                await _enrollmentRepo.AddRangeAsync(newEnrollments);

            return OperationResult<PaymentDto>.Ok(new PaymentDto
            {
                Id = payment.Id,
                ApplicationId = payment.ApplicationId,
                Amount = payment.Amount,
                Status = payment.Status,
                Method = payment.Method,
                PaidAt = payment.PaidAt
            });
        }

        public async Task<List<PaymentDto>> GetMyPaymentsAsync(int userId)
        {
            var payments = await _paymentRepo.GetByUserIdAsync(userId);
            return payments.Select(p => new PaymentDto
            {
                Id = p.Id,
                ApplicationId = p.ApplicationId,
                Amount = p.Amount,
                Status = p.Status,
                Method = p.Method,
                PaidAt = p.PaidAt
            }).ToList();
        }
    }
}