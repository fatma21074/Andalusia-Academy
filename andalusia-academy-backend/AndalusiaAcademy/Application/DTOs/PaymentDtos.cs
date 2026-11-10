using System.ComponentModel.DataAnnotations;

namespace Application.DTOs
{
    public class CreatePaymentDto
    {
        [Range(1, int.MaxValue, ErrorMessage = "Application is required.")]
        public int ApplicationId { get; set; }

        [MaxLength(30)]
        public string Method { get; set; } = "simulation";
    }

    public class PaymentDto
    {
        public int Id { get; set; }
        public int ApplicationId { get; set; }
        public decimal Amount { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Method { get; set; }
        public DateTime? PaidAt { get; set; }
    }
}