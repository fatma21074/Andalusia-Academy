using Domain.Models;
using Application.DTOs;
using Application.Common;
using Application.Repositories;
using Application.Integrations;

namespace Application.Services
{
    public class PaymentService
    {
        private readonly IApplicationRepository _appRepo;
        private readonly IPaymentRepository _paymentRepo;
        private readonly IEnrollmentRepository _enrollmentRepo;
        private readonly IProgramRepository _programRepo;
        private readonly IUserRepository _userRepo;
        private readonly IKashierClient _kashier;
        private readonly NotificationService _notifications;

        public PaymentService(
            IApplicationRepository appRepo,
            IPaymentRepository paymentRepo,
            IEnrollmentRepository enrollmentRepo,
            IProgramRepository programRepo,
            IUserRepository userRepo,
            IKashierClient kashier,
            NotificationService notifications)
        {
            _appRepo = appRepo;
            _paymentRepo = paymentRepo;
            _enrollmentRepo = enrollmentRepo;
            _programRepo = programRepo;
            _userRepo = userRepo;
            _kashier = kashier;
            _notifications = notifications;
        }

        // Starts a real checkout and returns the URL the frontend should redirect the learner to.
        public async Task<OperationResult<string>> StartCheckoutAsync(int userId, CreatePaymentDto request, string customerEmail, string callbackBaseUrl)
        {
            var application = await _appRepo.GetByIdAsync(request.ApplicationId);
            if (application is null || application.UserId != userId)
                return OperationResult<string>.Fail(OperationStatus.NotFound, "Application not found.");

            decimal amount = application.Course?.Price ?? application.Program?.Price
                ?? throw new InvalidOperationException("Application has neither a course nor a program.");

            var payment = application.Payment;

            if (payment is not null && payment.Status == "paid")
                return OperationResult<string>.Fail(OperationStatus.Conflict, "This application has already been paid.");

            // A checkout was started earlier and never confirmed. The learner may have paid on Kashier
            // and never come back to us, so ask Kashier first: starting a second checkout on a charge
            // that actually landed would charge them twice.
            if (payment is not null && payment.Status == "pending" && payment.SessionId is not null)
            {
                var earlier = await ConfirmCheckoutAsync(payment.Id);
                if (earlier.Status == OperationStatus.Success)
                    return OperationResult<string>.Fail(OperationStatus.Conflict, "This application has already been paid.");
            }

            if (payment is null)
            {
                payment = new Payment
                {
                    ApplicationId = application.Id,
                    Amount = amount,
                    Status = "pending",
                    Method = "kashier"
                };
                await _paymentRepo.AddAsync(payment);
            }
            else
            {
                // One Payment row per application (unique index), so a failed or abandoned
                // attempt is reused, not duplicated.
                payment.Status = "pending";
                payment.Amount = amount;
                payment.Method = "kashier";
                payment.SessionId = null;
                payment.PaidAt = null;
                await _paymentRepo.SaveChangesAsync();
            }

            // Our own payment id (never anything Kashier sends back) is what the callback uses to find the payment.
            var redirectUrl = $"{callbackBaseUrl}/api/payments/kashier-callback?paymentId={payment.Id}";

            // Each checkout attempt gets its own Kashier order id.
            var session = await _kashier.CreateSessionAsync(
                orderId: $"andalusia-{payment.Id}-{DateTime.UtcNow:yyyyMMddHHmmss}",
                amount: amount,
                customerEmail: customerEmail,
                redirectUrl: redirectUrl);

            payment.SessionId = session.SessionId;
            await _paymentRepo.SaveChangesAsync();

            return OperationResult<string>.Ok(session.SessionUrl);
        }

        // Called from the callback once the learner returns from Kashier's checkout.
        public async Task<OperationResult<PaymentDto>> ConfirmCheckoutAsync(int paymentId)
        {
            var payment = await _paymentRepo.GetByIdAsync(paymentId);
            if (payment is null || payment.SessionId is null)
                return OperationResult<PaymentDto>.Fail(OperationStatus.NotFound, "No payment found.");

            if (payment.Status == "paid")
                return OperationResult<PaymentDto>.Ok(ToDto(payment)); // already confirmed, safe to re-visit

            var verify = await _kashier.VerifySessionAsync(payment.SessionId);
            if (!verify.Success)
            {
                // Read-only on purpose: this runs from an unauthenticated callback, so a request that
                // isn't backed by a verified payment must not change anything. The payment stays
                // "pending" and the learner can simply retry from My Applications.
                return OperationResult<PaymentDto>.Fail(OperationStatus.BadRequest, "Payment was not successful.");
            }

            var application = await _appRepo.GetByIdAsync(payment.ApplicationId);
            if (application is null)
                return OperationResult<PaymentDto>.Fail(OperationStatus.NotFound, "Application not found.");

            payment.Status = "paid";
            payment.PaidAt = DateTime.UtcNow;
            application.Status = "approved";

            var newEnrollments = new List<Enrollment>();
            var userId = application.UserId;

            if (application.CourseId.HasValue)
            {
                if (!await _enrollmentRepo.ExistsAsync(userId, application.CourseId.Value))
                {
                    newEnrollments.Add(new Enrollment
                    {
                        ApplicationId = application.Id, UserId = userId,
                        CourseId = application.CourseId.Value, Status = "active"
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
                            ApplicationId = application.Id, UserId = userId,
                            CourseId = pc.CourseId, Status = "active"
                        });
                    }
                }
            }

            await _paymentRepo.SaveChangesAsync();
            if (newEnrollments.Count > 0)
                await _enrollmentRepo.AddRangeAsync(newEnrollments);

            var user = await _userRepo.GetByIdAsync(userId);
            if (user is not null)
            {
                await _notifications.NotifyAsync(
                    user, "payment", "Payment confirmed",
                    $"Payment of {payment.Amount:F2} EGP confirmed.",
                    "Payment confirmed",
                    $"Your payment of <strong>{payment.Amount:F2} EGP</strong> was successful. You're now enrolled. Head to My Courses to get started.");
            }

            return OperationResult<PaymentDto>.Ok(ToDto(payment));
        }

        public async Task<List<PaymentDto>> GetMyPaymentsAsync(int userId)
        {
            var payments = await _paymentRepo.GetByUserIdAsync(userId);
            return payments.Select(ToDto).ToList();
        }

        private static PaymentDto ToDto(Payment p) => new()
        {
            Id = p.Id, ApplicationId = p.ApplicationId, Amount = p.Amount,
            Status = p.Status, Method = p.Method, PaidAt = p.PaidAt
        };
    }
}