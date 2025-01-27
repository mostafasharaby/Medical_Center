using Microsoft.AspNetCore.Identity;

namespace AngularApi.Models
{
    public class AppUser :IdentityUser
    {
        public string? Address { get; set; }
    }
}
