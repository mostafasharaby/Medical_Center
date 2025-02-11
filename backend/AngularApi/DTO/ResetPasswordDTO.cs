namespace AngularApi.DTO
{
    public class ResetPasswordDTO
    {
        public string? Email { get; set; }
        public string? Token { get; set; }
        public string? NewPassword { get; set; }
    }
}
