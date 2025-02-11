using AngularApi.Models;
using AngularApi.Services.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace AngularApi.Services.impelementation
{
    public class GoogleService : IGoogleService
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IJwtService _jwtService;

        public GoogleService(UserManager<AppUser> userManager, IHttpContextAccessor httpContextAccessor, IJwtService jwtService)
        {
            _userManager = userManager;
            _httpContextAccessor = httpContextAccessor;
            _jwtService = jwtService;
        }

        public AuthenticationProperties GetGoogleLoginProperties(string redirectUri)
        {
            return new AuthenticationProperties { RedirectUri = redirectUri };
        }

        public async Task<string> GoogleLoginCallbackAsync()
        {
            var authenticateResult = await AuthenticateExternalUserAsync();
            if (authenticateResult == null)
            {
                throw new UnauthorizedAccessException("External login failed.");
            }

            var externalUser = authenticateResult.Principal;
            var email = externalUser.FindFirstValue(ClaimTypes.Email);
            var user = await FindOrCreateUserAsync(externalUser, email);

            return _jwtService.GenerateJwtToken(user);
        }

        private async Task<AuthenticateResult> AuthenticateExternalUserAsync()
        {
            return await _httpContextAccessor.HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        }

        private async Task<AppUser> FindOrCreateUserAsync(ClaimsPrincipal externalUser, string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user != null) return user;

            var userName = GenerateUniqueUserName(externalUser);
            user = new AppUser { UserName = userName, Email = email };

            var createUserResult = await _userManager.CreateAsync(user);
            if (!createUserResult.Succeeded)
            {
                throw new Exception("Error creating user.");
            }

            await _userManager.AddLoginAsync(user, new UserLoginInfo("Google", externalUser.FindFirstValue(ClaimTypes.NameIdentifier), "Google"));
            return user;
        }

        private string GenerateUniqueUserName(ClaimsPrincipal externalUser)
        {
            var baseName = externalUser.FindFirstValue(ClaimTypes.Name)?.Replace(" ", "_") ?? "User";
            return $"{baseName}_{Guid.NewGuid().ToString().Substring(0, 4)}";
        }
    }
}
