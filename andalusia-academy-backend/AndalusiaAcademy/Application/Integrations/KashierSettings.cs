namespace Application.Integrations
{
    public class KashierSettings
    {
        public string MerchantId { get; set; } = string.Empty;
        public string PaymentApiKey { get; set; } = string.Empty; // "api-key" header
        public string SecretKey { get; set; } = string.Empty;     // "Authorization" header (raw, not Bearer)
        public string BaseUrl { get; set; } = "https://test-api.kashier.io"; // test- prefix; swap for live later

        // Public address of THIS API, as Kashier's redirect should reach it.
        // Empty = fall back to the address of the current request.
        public string? CallbackBaseUrl { get; set; }
    }
}