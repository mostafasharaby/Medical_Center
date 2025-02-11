using AngularApi.DTO;
using AngularApi.Models;
using AngularApi.Services;
using AngularApi.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Security.Claims;
using Response = AngularApi.Services.Response;

namespace AngularApi.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {

        /// <summary>
        ///    { "email": "mustafasharaby18@gmail.com", "password": "0133asdASD*"}      
        ///   { "email": "dodo@gmail.com", "password": "0133asdASD*"}   
        ///   {"email": "admin@gmail.com", "password": "0133asdASD*"}
        ///   works
        /// </summary>
        private readonly UserManager<AppUser> _userManager;
        private readonly IConfiguration _Configuration;
        private readonly IUserService _userService;
        private readonly IEmailService _emailService;
        private readonly IJwtService _jwtService;
        private readonly IGoogleService _googleService;
        private readonly EmailTemplateService _emailTemplateService;
        public AccountController(UserManager<AppUser> userManager, IConfiguration Configuration, IEmailService emailService,
            EmailTemplateService emailTemplateService, IJwtService jwtService, IGoogleService googleService)
        {
            _userManager = userManager;
            _Configuration = Configuration;
            _emailService = emailService;
            _emailTemplateService = emailTemplateService;
            _jwtService = jwtService;
            _googleService = googleService;
            // this._signInManager = _signInManager;

        }
        [HttpPost("register/user")]
        public async Task<IActionResult> Register(RegisterUserDTO registerUser)
        {
            if (ModelState.IsValid)
            {
                Patient appUser = new Patient();
                appUser.UserName = registerUser.UserName;
                appUser.Email = registerUser.Email;

                IdentityResult result = await _userManager.CreateAsync(appUser, registerUser.Password);

                if (result.Succeeded)
                {

                    await _userManager.AddToRoleAsync(appUser, "user");
                    /// return Ok(new { message = "Account created successfully with role." });
                    var token = await _userManager.GenerateEmailConfirmationTokenAsync(appUser);
                    var confirmationLink = Url.Action(nameof(ConfirmEmail), "Account",
                        new { userId = appUser.Id, token }, Request.Scheme);

                    var confirmtionLinkForFront = $"http://localhost:4200/auth/confirm-email?userId={appUser.Id}&token={WebUtility.UrlEncode(token)}";

                    var emailBody = _emailTemplateService.GetConfirmationEmail(appUser.UserName, confirmtionLinkForFront);
                    var message = new Message(new[] { appUser.Email }, "Confirm Your Email", emailBody);

                    try
                    {
                        _emailService.SendEmail(message);

                        return Ok(new { message = "Account created successfully. Please check your email to confirm your account." });
                    }
                    catch (Exception ex)
                    {
                        // Handle email sending failure
                        return StatusCode(StatusCodes.Status500InternalServerError, new { error = "Failed to send email. Please try again later." });
                    }
                }
                return BadRequest(result.Errors.FirstOrDefault().Description.ToString());
            }
            return BadRequest(ModelState);
        }


        [HttpPost("Register/admin")]
        public async Task<IActionResult> RegisterWithAdmin(RegisterUserDTO registerUser)
        {
            if (ModelState.IsValid)
            {
                AppUser appUser = new AppUser();
                appUser.UserName = registerUser.UserName;
                appUser.Email = registerUser.Email;

                // appUser.PasswordHash = registerUser.Password;
                IdentityResult result = await _userManager.CreateAsync(appUser, registerUser.Password);
                if (result.Succeeded)
                {
                    // var role = registerUser.Role ?? "user"; // Default role to "user"
                    await _userManager.AddToRoleAsync(appUser, "admin");
                    return Ok(new { message = "Account created successfully with role." });
                }
                return BadRequest(result.Errors.FirstOrDefault().Description.ToString());
            }
            return BadRequest(ModelState);
        }

        [HttpPost("Register/doctor")]
        public async Task<IActionResult> RegisterWithDoctor(RegisterUserDTO registerUser)
        {
            if (ModelState.IsValid)
            {
                Doctor appUser = new Doctor();
                appUser.UserName = registerUser.UserName;
                appUser.Email = registerUser.Email;

                IdentityResult result = await _userManager.CreateAsync(appUser, registerUser.Password);
                if (result.Succeeded)
                {
                    // var role = registerUser.Role ?? "user"; // Default role to "user"
                    await _userManager.AddToRoleAsync(appUser, "doctor");
                    return Ok(new { message = "Account created successfully with role." });
                }
                return BadRequest(result.Errors.FirstOrDefault().Description.ToString());
            }
            return BadRequest(ModelState);
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login(LogInUserDTO logInUser)
        {
            if (ModelState.IsValid)
            {
                var found = await _userManager.FindByEmailAsync(logInUser.Email);
                if (found != null)
                {
                    AppUser appUser = new AppUser();
                    appUser.Email = logInUser.Email;

                    var checkpass = await _userManager.CheckPasswordAsync(found, logInUser.Password);
                    if (checkpass)
                    {
                        var tokenGenerated = _jwtService.GenerateJwtToken(found);
                        return Ok(new
                        {
                            token = tokenGenerated,
                            expiration = DateTime.Now.AddDays(1)
                        });
                    }
                }
                return Unauthorized();
            }
            return BadRequest(ModelState);
        }


        [HttpGet("LoginWithGoogle")]
        public IActionResult LoginWithGoogle()
        {
            var properties = _googleService.GetGoogleLoginProperties(Url.Action(nameof(GoogleLoginCallback)));
            return Challenge(properties, "Google");
        }


        [HttpGet("GoogleLoginCallback")]
        public async Task<IActionResult> GoogleLoginCallback()
        {
            try
            {
                var token = await _googleService.GoogleLoginCallbackAsync();
                return Redirect($"http://localhost:4200/auth/login-success?token={token}");
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized("External login failed.");
            }
            catch
            {
                return BadRequest("An error occurred during Google login.");
            }
        }


        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordDTO forgotPasswordDto)
        {
            if (ModelState.IsValid)
            {
                var user = await _userManager.FindByEmailAsync(forgotPasswordDto.Email);
                if (user == null)
                {
                    return Ok(new { message = "If an account with that email exists, a reset link has been sent." });
                }
                var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
                var encodedToken = WebUtility.UrlEncode(resetToken);

                var resetLink = Url.Action(
                    nameof(ResetPassword),
                    "Account",
                    new { token = encodedToken, email = user.Email },
                    Request.Scheme);

                // var resetLink = $"http://localhost:4200/auth/reset-password?token={resetToken}&email={user.Email}";
                var message = new Message(new[] { user.Email }, "Forgot Password Link", resetLink);

                try
                {
                    _emailService.SendEmail(message);
                    return Ok(new Response("Success", $"Password reset link sent to {user.Email}. Please check your email."));
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Failed to send email: {ex.Message}");
                    return StatusCode(StatusCodes.Status500InternalServerError, new Response("Error", "Failed to send email, please try again later."));
                }

            }

            return BadRequest(ModelState);
        }

        [HttpGet("reset-password")]
        public IActionResult ResetPassword(string token, string email)
        {
            if (string.IsNullOrEmpty(token) || string.IsNullOrEmpty(email))
            {
                return BadRequest(new { Status = "Error", Message = "Invalid password reset link." });
            }

            // Return success response for valid tokens
            //return Ok(new { Status = "Success", Message = "Password reset link is valid.", Token = token, Email = email }); 
            return Redirect($"http://localhost:4200/auth/reset-password?token={token}&email={email}");
        }



        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDTO resetPasswordDto)
        {
            if (ModelState.IsValid)
            {
                var user = await _userManager.FindByEmailAsync(resetPasswordDto.Email);
                if (user == null)
                {
                    return BadRequest(new { message = "Invalid request." });
                }

                var decodedToken = WebUtility.UrlDecode(resetPasswordDto.Token);
                var result = await _userManager.ResetPasswordAsync(user, resetPasswordDto.Token, resetPasswordDto.NewPassword);

                if (result.Succeeded)
                {
                    return Ok(new { message = "Password has been reset successfully." });
                }

                Console.WriteLine($"Errors: {string.Join(", ", result.Errors.Select(e => e.Description))}");
                return BadRequest(result.Errors.FirstOrDefault()?.Description);
            }

            return BadRequest(ModelState);
        }

        /// <summary>
        ///    { "email": "mustafasharaby18@gmail.com", "password": "0133asdASD//"}      
        ///   { "email": "ramyy@gmail.com", "password": "0133asdASD*"}      
        ///   works
        /// </summary>
        /// 


        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound("User not found");

            var result = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);
            if (!result.Succeeded) return BadRequest(result.Errors);

            return Ok("Password changed successfully");
        }


        [HttpPut("update-profile")]
        public async Task<IActionResult> UpdateProfile(UpdateProfileDto model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound("User not found");

            user.UserName = model.UserName;
            user.Email = model.Email;
            user.Address = model.Address;
            user.PhoneNumber = model.PhoneNumber;


            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded) return BadRequest(result.Errors);

            return Ok("Profile updated successfully");
        }

        [HttpGet("confirm-email")]
        public async Task<IActionResult> ConfirmEmail(string userId, string token)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound("User not found");

            var result = await _userManager.ConfirmEmailAsync(user, token);
            if (!result.Succeeded) return BadRequest("Email confirmation failed");

            var confirmtionLinkForFront = $"http://localhost:4200/auth/confirm-email?userId={userId}&token={token}";
            // return Redirect(confirmtionLinkForFront);
            return Ok(new { Message = "Email confirmed successfully." });
        }

        [HttpPost("resend-email-confirmation")]
        public async Task<IActionResult> ResendEmailConfirmation([FromBody] ResendEmailConfirmationDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null) return NotFound("User not found");

            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var confirmationLink = Url.Action(nameof(ConfirmEmail), "Account", new { userId = user.Id, token }, Request.Scheme);

            // Assume a method for sending email exists
            //await SendEmailAsync(user.Email, "Confirm your email", confirmationLink);

            return Ok("Email confirmation link sent");
        }


        [HttpGet("user-details")]
        public async Task<IActionResult> GetUserDetails()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);
            //var user = await _userService.GetCurrentUserAsync();
            if (user == null) return NotFound("User not found");

            return Ok(new
            {
                user.Email,
                user.UserName,
                user.Address,
                user.PhoneNumber
            });
        }


        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteAccount()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound("User not found");

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded) return BadRequest(result.Errors);

            return Ok("Account deleted successfully");
        }


    }

}
