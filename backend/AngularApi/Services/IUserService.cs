using AngularApi.Models;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace AngularApi.Services
{
    public interface IUserService
    {
        Task<Patient> GetCurrentUserAsync();
    }
    public class UserService : IUserService
    {
        private readonly UserManager<Patient> _userManager;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserService(UserManager<Patient> userManager, IHttpContextAccessor httpContextAccessor)
        {
            _userManager = userManager;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<Patient> GetCurrentUserAsync()
        {
            var context = _httpContextAccessor.HttpContext;
            if (context == null)
            {
                throw new InvalidOperationException("HttpContext is null");
            }

            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                throw new InvalidOperationException("User ID not found");
            }

            var user = await _userManager.FindByIdAsync(userId);
            return user;
        }


    }
}
