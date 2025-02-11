using AngularApi.Models;

namespace AngularApi.Services.Interfaces
{
    public interface IJwtService
    {
        string GenerateJwtToken(AppUser user);
    }
}
