using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using Application.Services;
using Application.DTOs;
using Application.Common;
using Application.Integrations;

namespace AndalusiaAcademy.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly PaymentService _service;
        private readonly KashierSettings _kashier;
        private readonly string _frontendBase;

        public PaymentsController(PaymentService service, IOptions<KashierSettings> kashier, IConfiguration config)
        {
            _service = service;
            _kashier = kashier.Value;
            // Where the learner lands after paying. Local default is the Vite dev server;
            // in production set Frontend:BaseUrl to the site's address (the API serves the React app itself).
            _frontendBase = (config["Frontend:BaseUrl"] ?? "http://localhost:5173").TrimEnd('/');
        }

        private int CurrentUserId =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // POST /api/payments: starts a real Kashier checkout, returns the URL to redirect to
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Pay(CreatePaymentDto request)
        {
            var email = User.FindFirstValue(ClaimTypes.Email)!;

            var callbackBaseUrl = string.IsNullOrWhiteSpace(_kashier.CallbackBaseUrl)
                ? $"{Request.Scheme}://{Request.Host}"
                : _kashier.CallbackBaseUrl.TrimEnd('/');

            var result = await _service.StartCheckoutAsync(CurrentUserId, request, email, callbackBaseUrl);
            return result.Status switch
            {
                OperationStatus.Success => Ok(new { checkoutUrl = result.Data }),
                OperationStatus.NotFound => NotFound(new { message = result.Message }),
                OperationStatus.Conflict => Conflict(new { message = result.Message }),
                _ => StatusCode(500)
            };
        }

        // GET /api/payments/kashier-callback?paymentId=5: Kashier redirects the learner's browser here.
        // No [Authorize]: the browser arrives straight from Kashier, with no JWT attached.
        [HttpGet("kashier-callback")]
        public async Task<IActionResult> KashierCallback([FromQuery] int paymentId)
        {
            var result = await _service.ConfirmCheckoutAsync(paymentId);

            return result.Status == OperationStatus.Success
                ? Redirect($"{_frontendBase}/checkout/result?paymentId={paymentId}&status=success")
                : Redirect($"{_frontendBase}/checkout/result?paymentId={paymentId}&status=failed");
        }

        // GET /api/payments/my
        [HttpGet("my")]
        [Authorize]
        public async Task<ActionResult<List<PaymentDto>>> GetMy()
        {
            var payments = await _service.GetMyPaymentsAsync(CurrentUserId);
            return Ok(payments);
        }
    }
}