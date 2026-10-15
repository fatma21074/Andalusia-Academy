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
    [Authorize]
    public class PaymentsController : ControllerBase
    {
        private readonly PaymentService _service;
        public PaymentsController(PaymentService service) => _service = service;

        private int CurrentUserId =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // POST /api/payments
        [HttpPost]
        public async Task<ActionResult<PaymentDto>> Pay(CreatePaymentDto request)
        {
            var result = await _service.PayAsync(CurrentUserId, request);
            return result.Status switch
            {
                OperationStatus.Success => Ok(result.Data),
                OperationStatus.NotFound => NotFound(new { message = result.Message }),
                OperationStatus.Conflict => Conflict(new { message = result.Message }),
                _ => StatusCode(500)
            };
        }

        // GET /api/payments/my
        [HttpGet("my")]
        public async Task<ActionResult<List<PaymentDto>>> GetMy()
        {
            var payments = await _service.GetMyPaymentsAsync(CurrentUserId);
            return Ok(payments);
        }
    }
}