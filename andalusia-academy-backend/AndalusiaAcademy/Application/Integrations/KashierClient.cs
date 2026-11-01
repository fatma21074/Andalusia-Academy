        public async Task<KashierVerifyResult> VerifySessionAsync(string sessionId)
        {
            var request = new HttpRequestMessage(HttpMethod.Get, $"{_settings.BaseUrl}/v3/payment/sessions/{sessionId}/payment");
            request.Headers.Add("Authorization", _settings.SecretKey);

            var response = await _http.SendAsync(request);
            var rawJson = await response.Content.ReadAsStringAsync();

            string? status = null;
            string? code = null;
            try
            {
                using var doc = JsonDocument.Parse(rawJson);
                if (doc.RootElement.ValueKind == JsonValueKind.Object &&
                    doc.RootElement.TryGetProperty("data", out var data) &&
                    data.ValueKind == JsonValueKind.Object)
                {
                    if (data.TryGetProperty("status", out var s) && s.ValueKind == JsonValueKind.String)
                        status = s.GetString();
                    code = Search(data); // response code of the latest transaction, for the log only
                }
            }
            catch (JsonException) { }

            // Outcome only: no card details or personal data in the log.
            Console.WriteLine($"[Kashier verify] session {sessionId}: status={status ?? "?"}, code={code ?? "?"}");

            // data.status is "PAID" once the payment has gone through (seen in the real sandbox response).
            return new KashierVerifyResult
            {
                Success = response.IsSuccessStatusCode && status == "PAID",
                ResponseCode = code,
                RawJson = rawJson
            };
        }