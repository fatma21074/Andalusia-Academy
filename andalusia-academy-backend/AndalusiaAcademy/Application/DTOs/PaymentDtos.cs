namespace Application.DTOs
{
    public class CreatePaymentDto
    {
        public int ApplicationId { get; set; }
        public string Method { get; set; } = "simulation"; // "simulation" for now — Sprint plan allows gateway OR agreed simulation
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