using Microsoft.AspNetCore.Authentication;

namespace AngularApi.Services.Interfaces
{
    public interface IGoogleService
    {
        AuthenticationProperties GetGoogleLoginProperties(string redirectUri);
        Task<string> GoogleLoginCallbackAsync();
    }
}
