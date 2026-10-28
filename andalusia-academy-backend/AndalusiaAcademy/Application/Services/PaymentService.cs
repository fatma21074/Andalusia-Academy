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

        // Starts a real checkout. callbackBaseUrl is OUR OWN backend's address (e.g. http://localhost:5120) —
        // the controller supplies it from the current request, so this works unchanged in dev or once deployed.
        public async Task<OperationResult<string>> StartCheckoutAsync(int userId, CreatePaymentDto request, string customerEmail, string callbackBaseUrl)
        {
            var application = await _appRepo.GetByIdAsync(request.ApplicationId);
            if (application is null || application.UserId != userId)
                return OperationResult<string>.Fail(OperationStatus.NotFound, "Application not found.");

            if (application.Payment is not null)
                return OperationResult<string>.Fail(OperationStatus.Conflict, "This application has already been paid.");

            decimal amount = application.Course?.Price ?? application.Program?.Price
                ?? throw new InvalidOperationException("Application has neither a course nor a program.");

            var payment = new Payment
            {
                ApplicationId = application.Id,
                Amount = amount,
                Status = "pending",
                Method = "kashier"
            };
            await _paymentRepo.AddAsync(payment); // mints payment.Id

            // Our own route param — never Kashier's redirect query string — is what the callback trusts to look the payment up.
            var redirectUrl = $"{callbackBaseUrl}/api/payments/kashier-callback?paymentId={payment.Id}";

            var session = await _kashier.CreateSessionAsync(
                orderId: $"andalusia-{payment.Id}",
                amount: amount,
                customerEmail: customerEmail,
                redirectUrl: redirectUrl);

            payment.SessionId = session.SessionId;
            await _paymentRepo.SaveChangesAsync();

            return OperationResult<string>.Ok(session.SessionUrl);
        }

        // Called from the callback once the learner returns from Kashier's checkout.
        // paymentId comes from OUR OWN redirect URL above, not from anything Kashier sent — it is
        // only ever used to look the payment up; the actual confirmation is the VerifySessionAsync call below.
        public async Task<OperationResult<PaymentDto>> ConfirmCheckoutAsync(int paymentId)
        {
            var payment = await _paymentRepo.GetByIdAsync(paymentId);
            if (payment is null || payment.SessionId is null)
                return OperationResult<PaymentDto>.Fail(OperationStatus.NotFound, "No payment found.");

            if (payment.Status == "paid")
                return OperationResult<PaymentDto>.Ok(ToDto(payment)); // already confirmed — safe to re-visit this page

            var verify = await _kashier.VerifySessionAsync(payment.SessionId);
            if (!verify.Success)
            {
                payment.Status = "failed";
                await _paymentRepo.SaveChangesAsync();
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
                    $"Your payment of <strong>{payment.Amount:F2} EGP</strong> was successful. You're now enrolled — head to My Courses to get started.");
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