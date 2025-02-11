using AngularApi.Models;

namespace AngularApi.Services.Interfaces
{
    public interface IUserService
    {
        Task<AppUser> GetCurrentUserAsync();
    }
}
