using Domain.Models;
using Application.DTOs;
using Application.Repositories;
using Application.Auth;

namespace Application.Services
{
    public class AuthService
    {
        private readonly IUserRepository _userRepo;
        private readonly ITokenService _tokenService;
        private readonly NotificationService _notifications;

        public AuthService(IUserRepository userRepo, ITokenService tokenService, NotificationService notifications)
        {
            _userRepo = userRepo;
            _tokenService = tokenService;
            _notifications = notifications;
        }

        public async Task<AuthResponseDto?> RegisterAsync(RegisterRequestDto request)
        {
            if (await _userRepo.EmailExistsAsync(request.Email))
                return null; // caller turns this into a 409 Conflict

            var learnerRole = await _userRepo.GetRoleByNameAsync("Learner")
                ?? throw new InvalidOperationException("Seed data is missing the 'Learner' role.");

            var user = new User
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                PhoneNumber = request.PhoneNumber,
                Country = request.Country,
                PreferredLanguage = request.PreferredLanguage,
                Role = learnerRole
            };

            await _userRepo.AddUserAsync(user);
                        await _notifications.NotifyAsync(
                user, "registration", "Welcome to Andalusia Academy",
                "Account created successfully.",
                $"Welcome, {user.FirstName}!",
                "Your account has been created. You can now browse courses, programs, and career paths, and apply whenever you're ready.");

            return new AuthResponseDto
            {
                Token = _tokenService.GenerateToken(user),
                UserId = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Role = learnerRole.Name
            };
        }

        public async Task<AuthResponseDto?> LoginAsync(LoginRequestDto request)
        {
            var user = await _userRepo.GetByEmailAsync(request.Email);
            if (user is null) return null; // caller turns this into a 401

            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                return null; // same 401 — never reveal "email exists but password wrong"

            return new AuthResponseDto
            {
                Token = _tokenService.GenerateToken(user),
                UserId = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Role = user.Role.Name
            };
        }

        public async Task<UserProfileDto?> GetProfileAsync(int userId)
        {
            var user = await _userRepo.GetByIdAsync(userId);
            if (user is null) return null;

            return new UserProfileDto
            {
                UserId = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Country = user.Country,
                Role = user.Role.Name
            };
        }
    }
}