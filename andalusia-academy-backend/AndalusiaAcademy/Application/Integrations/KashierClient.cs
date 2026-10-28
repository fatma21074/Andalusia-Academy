using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Options;

namespace Application.Integrations
{
    public class KashierClient : IKashierClient
    {
        private readonly HttpClient _http;
        private readonly KashierSettings _settings;

        public KashierClient(HttpClient http, IOptions<KashierSettings> settings)
        {
            _http = http;
            _settings = settings.Value;
        }

        public async Task<KashierSessionResult> CreateSessionAsync(string orderId, decimal amount, string customerEmail, string redirectUrl)
        {
            var request = new HttpRequestMessage(HttpMethod.Post, $"{_settings.BaseUrl}/v3/payment/sessions");
            request.Headers.Add("Authorization", _settings.SecretKey); // raw value, not "Bearer "
            request.Headers.Add("api-key", _settings.PaymentApiKey);
            request.Content = JsonContent.Create(new
            {
                expireAt = DateTime.UtcNow.AddHours(2).ToString("yyyy-MM-ddTHH:mm:ss.fffZ"),
                maxFailureAttempts = 3,
                amount = amount.ToString("F2"),
                currency = "EGP",
                order = orderId,
                merchantId = _settings.MerchantId,
                merchantRedirect = redirectUrl,
                type = "one-time",
                display = "en",
                allowedMethods = "card,wallet",
                customer = new { email = customerEmail, reference = orderId }
            });

            var response = await _http.SendAsync(request);
            response.EnsureSuccessStatusCode();

            var body = await response.Content.ReadFromJsonAsync<JsonElement>();
            var sessionUrl = body.GetProperty("sessionUrl").GetString()!;

            // The session id isn't a separate field — Kashier only gives it back embedded
            // in the sessionUrl's path, e.g. https://payments.kashier.io/session/<id>?mode=test
            var sessionId = new Uri(sessionUrl).Segments[^1].TrimEnd('/');

            return new KashierSessionResult { SessionUrl = sessionUrl, SessionId = sessionId };
        }

        public async Task<KashierVerifyResult> VerifySessionAsync(string sessionId)
        {
            var request = new HttpRequestMessage(HttpMethod.Get, $"{_settings.BaseUrl}/v3/payment/sessions/{sessionId}/payment");
            request.Headers.Add("Authorization", _settings.SecretKey);

            var response = await _http.SendAsync(request);
            var rawJson = await response.Content.ReadAsStringAsync();

            // Known for certain: Kashier uses "00" for an accepted transaction across its APIs.
            // What's NOT yet confirmed: the exact nesting on THIS endpoint's response — so we
            // search for the field wherever it appears rather than assume one fixed path.
            var code = FindResponseCode(rawJson);

            return new KashierVerifyResult
            {
                Success = response.IsSuccessStatusCode && code == "00",
                ResponseCode = code,
                RawJson = rawJson
            };
        }

        private static string? FindResponseCode(string json)
        {
            try
            {
                using var doc = JsonDocument.Parse(json);
                return Search(doc.RootElement);
            }
            catch (JsonException)
            {
                return null;
            }
        }

        private static string? Search(JsonElement element)
        {
            if (element.ValueKind == JsonValueKind.Object)
            {
                foreach (var prop in element.EnumerateObject())
                {
                    if (prop.NameEquals("transactionResponseCode") && prop.Value.ValueKind == JsonValueKind.String)
                        return prop.Value.GetString();

                    var found = Search(prop.Value);
                    if (found is not null) return found;
                }
            }
            else if (element.ValueKind == JsonValueKind.Array)
            {
                foreach (var item in element.EnumerateArray())
                {
                    var found = Search(item);
                    if (found is not null) return found;
                }
            }
            return null;
        }
    }
}