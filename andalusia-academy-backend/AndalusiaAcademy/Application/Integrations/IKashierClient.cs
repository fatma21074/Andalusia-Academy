namespace Application.Integrations
{
    public class KashierSessionResult
    {
        public string SessionUrl { get; set; } = string.Empty;
        public string SessionId { get; set; } = string.Empty;
    }

    public class KashierVerifyResult
    {
        public bool Success { get; set; }
        public string? ResponseCode { get; set; }
        public string RawJson { get; set; } = string.Empty; // kept so we can see the real shape on the first live call
    }

    public interface IKashierClient
    {
        Task<KashierSessionResult> CreateSessionAsync(string orderId, decimal amount, string customerEmail, string redirectUrl);
        Task<KashierVerifyResult> VerifySessionAsync(string sessionId);
    }
}