using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Application.Services;
using Application.DTOs;
using Application.Common;

namespace AndalusiaAcademy.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly PaymentService _service;
        public PaymentsController(PaymentService service) => _service = service;

        private int CurrentUserId =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // POST /api/payments — starts a real Kashier checkout, returns the URL to redirect to
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Pay(CreatePaymentDto request)
        {
            var email = User.FindFirstValue(ClaimTypes.Email)!;
            var callbackBaseUrl = $"{Request.Scheme}://{Request.Host}";

            var result = await _service.StartCheckoutAsync(CurrentUserId, request, email, callbackBaseUrl);
            return result.Status switch
            {
                OperationStatus.Success => Ok(new { checkoutUrl = result.Data }),
                OperationStatus.NotFound => NotFound(new { message = result.Message }),
                OperationStatus.Conflict => Conflict(new { message = result.Message }),
                _ => StatusCode(500)
            };
        }

        // GET /api/payments/kashier-callback?paymentId=5 — Kashier redirects the learner's browser here.
        // No [Authorize]: the browser arrives here straight from Kashier, with no JWT attached.
        [HttpGet("kashier-callback")]
        public async Task<IActionResult> KashierCallback([FromQuery] int paymentId)
        {
            var result = await _service.ConfirmCheckoutAsync(paymentId);
            var frontendBase = "http://localhost:5173"; // matches the CORS origin already set in Program.cs

            return result.Status == OperationStatus.Success
                ? Redirect($"{frontendBase}/checkout/result?paymentId={paymentId}&status=success")
                : Redirect($"{frontendBase}/checkout/result?paymentId={paymentId}&status=failed");
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