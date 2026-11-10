using System.ComponentModel.DataAnnotations;

namespace Application.DTOs
{
    public class RegisterRequestDto
    {
        [Required(ErrorMessage = "First name is required."), MaxLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Last name is required."), MaxLength(100)]
        public string LastName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required."),
         EmailAddress(ErrorMessage = "Enter a valid email address."),
         MaxLength(200)]
        public string Email { get; set; } = string.Empty;

        // Same rule as the frontend (utils/validation.ts): 8+ characters, at least one letter and one number.
        // Max 72 because BCrypt only uses the first 72 bytes of a password.
        [Required(ErrorMessage = "Password is required."),
         MinLength(8, ErrorMessage = "Use at least 8 characters."),
         MaxLength(72, ErrorMessage = "Use at most 72 characters."),
         RegularExpression(@"^(?=.*[A-Za-z])(?=.*\d).+$", ErrorMessage = "Use at least one letter and one number.")]
        public string Password { get; set; } = string.Empty;

        [MaxLength(30)] public string? PhoneNumber { get; set; }
        [MaxLength(100)] public string? Country { get; set; }
        [MaxLength(50)] public string? PreferredLanguage { get; set; }
    }

    public class LoginRequestDto
    {
        [Required(ErrorMessage = "Email is required.")]
        public string Email { get; set; } = string.Empty;

        // Presence only: no complexity rules at login, so older accounts can still sign in.
        [Required(ErrorMessage = "Password is required.")]
        public string Password { get; set; } = string.Empty;
    }

    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public int UserId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }

    public class UserProfileDto
    {
        public int UserId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string? Country { get; set; }
        public string Role { get; set; } = string.Empty;
    }
}