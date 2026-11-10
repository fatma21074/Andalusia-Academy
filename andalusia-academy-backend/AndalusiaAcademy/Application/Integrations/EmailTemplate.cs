namespace Application.Integrations
{
    public static class EmailTemplate
    {
        // One shared layout, content swapped per event — matches the Final Sprint plan exactly:
        // "one HTML template, content swapped per event type."
        public static string Render(string heading, string bodyHtml)
        {
            return $@"
<!DOCTYPE html>
<html>
<body style=""font-family: Arial, sans-serif; background:#f5f6f2; margin:0; padding:24px;"">
  <table width=""100%"" cellpadding=""0"" cellspacing=""0"">
    <tr><td align=""center"">
      <table width=""480"" cellpadding=""0"" cellspacing=""0"" style=""background:#ffffff; border-radius:8px; overflow:hidden;"">
        <tr><td style=""background:#2c5f6f; padding:20px 28px;"">
          <span style=""color:#ffffff; font-size:18px; font-weight:bold;"">Andalusia Academy</span>
        </td></tr>
        <tr><td style=""padding:28px;"">
          <h2 style=""margin:0 0 16px; color:#1c2230;"">{heading}</h2>
          <div style=""color:#4b5265; font-size:15px; line-height:1.6;"">{bodyHtml}</div>
        </td></tr>
        <tr><td style=""padding:16px 28px; background:#eceee7; color:#8790a0; font-size:12px;"">
          This is an automated message from Andalusia Academy.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>";
        }
    }
}