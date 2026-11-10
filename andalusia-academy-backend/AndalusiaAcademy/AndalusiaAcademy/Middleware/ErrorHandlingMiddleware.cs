using Application.Integrations;

namespace AndalusiaAcademy.Middleware
{
    // Last line of defence: any exception that escapes a controller becomes a clean
    // JSON { message } response instead of a stack trace. It sits AFTER CORS in the
    // pipeline, so the error response still carries the CORS headers the browser needs.
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ErrorHandlingMiddleware> _logger;

        public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (OperationCanceledException) when (context.RequestAborted.IsCancellationRequested)
            {
                // The browser closed the connection: nothing to answer.
            }
            catch (Exception ex) when (!context.Response.HasStarted)
            {
                // The full detail stays in the server log; the client only gets a safe message.
                _logger.LogError(ex, "Unhandled exception on {Method} {Path}", context.Request.Method, context.Request.Path);

                var (status, message) = ex switch
                {
                    PaymentNotConfiguredException => (StatusCodes.Status503ServiceUnavailable,
                        "Online payment isn't set up on this server yet."),
                    BadHttpRequestException bad => (bad.StatusCode,
                        bad.StatusCode == 413 ? "That upload is too large." : "The request could not be read."),
                    HttpRequestException => (StatusCodes.Status502BadGateway,
                        "We couldn't reach the payment provider. Please try again in a moment."),
                    _ => (StatusCodes.Status500InternalServerError,
                        "Something went wrong on our side. Please try again.")
                };

                context.Response.StatusCode = status;
                await context.Response.WriteAsJsonAsync(new { message });
            }
        }
    }
}