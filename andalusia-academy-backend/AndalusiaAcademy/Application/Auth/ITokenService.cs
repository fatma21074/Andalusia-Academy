using Domain.Models;

namespace Application.Auth
{
    public interface ITokenService
    {
        string GenerateToken(User user);
    }
}