namespace Application.Integrations
{
    // Thrown when a payment is attempted but the Kashier keys were never set on this machine.
    public class PaymentNotConfiguredException : Exception
    {
        public PaymentNotConfiguredException()
            : base("Kashier is not configured on this machine. Set Kashier:MerchantId, Kashier:PaymentApiKey " +
                   "and Kashier:SecretKey with 'dotnet user-secrets set' (see the README, Quick start).")
        {
        }
    }
}