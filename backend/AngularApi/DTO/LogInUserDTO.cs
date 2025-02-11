using System.ComponentModel.DataAnnotations;

namespace AngularApi.DTO
{
    public class LogInUserDTO
    {
        [Required]
        public string Email { get; set; }


        [Required]
        public string Password { get; set; }
    }
}
