using AngularApi.Controllers;
using AngularApi.DTO;
using AngularApi.Models;
using AngularApi.Services;
using AngularApi.Services.Interfaces;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.Extensions.Configuration;
using Moq;
using System.Security.Claims;

namespace AngularApi.Tests.Controllers
{
    public class AccountControllerTests
    {
        private readonly Mock<UserManager<AppUser>> _userManagerMock;
        private readonly Mock<IConfiguration> _configurationMock;
        private readonly Mock<IEmailService> _emailServiceMock;
        private readonly Mock<IJwtService> _jwtServiceMock;
        private readonly Mock<IGoogleService> _googleServiceMock;
        private readonly Mock<EmailTemplateService> _emailTemplateService;
        private readonly AccountController _controller;

        public AccountControllerTests()
        {
            var store = new Mock<IUserStore<AppUser>>();
            _userManagerMock = new Mock<UserManager<AppUser>>(store.Object, null, null, null, null, null, null, null, null);

            _configurationMock = new Mock<IConfiguration>();
            _emailServiceMock = new Mock<IEmailService>();
            _jwtServiceMock = new Mock<IJwtService>();
            _googleServiceMock = new Mock<IGoogleService>();
            _emailTemplateService = new Mock<EmailTemplateService>();

            _controller = new AccountController(
                _userManagerMock.Object,
                _configurationMock.Object,
                _emailServiceMock.Object,
                _emailTemplateService.Object,
                _jwtServiceMock.Object,
                _googleServiceMock.Object);
        }



        [Fact]
        public async Task Register_InvalidModel_ReturnsBadRequest()
        {
            // Arrange
            _controller.ModelState.AddModelError("Email", "Email is required");

            // Act
            var result = await _controller.Register(new RegisterUserDTO());

            // Assert
            result.Should().BeOfType<BadRequestObjectResult>();
        }

        [Fact]
        public async Task Register_CreateFails_ReturnsBadRequestWithError()
        {
            // Arrange
            var registerDto = new RegisterUserDTO
            {
                UserName = "testuser",
                Email = "test@example.com",
                Password = "Password123!"
            };
            var identityError = new IdentityError { Description = "User creation failed" };
            _userManagerMock.Setup(x => x.CreateAsync(It.IsAny<Patient>(), registerDto.Password))
                .ReturnsAsync(IdentityResult.Failed(identityError));

            // Act
            var result = await _controller.Register(registerDto);

            // Assert
            var badRequestResult = result.Should().BeOfType<BadRequestObjectResult>().Subject;
            badRequestResult.Value.Should().Be("User creation failed");
        }

        [Fact]
        public async Task Login_ValidCredentials_ReturnsOkWithToken()
        {
            // Arrange
            var loginDto = new LogInUserDTO
            {
                Email = "ramyy@gmail.com",
                Password = "0133asdASD*"
            };
            var user = new AppUser { Email = loginDto.Email };
            _userManagerMock.Setup(x => x.FindByEmailAsync(loginDto.Email))
                .ReturnsAsync(user);
            _userManagerMock.Setup(x => x.CheckPasswordAsync(user, loginDto.Password))
                .ReturnsAsync(true);
            _jwtServiceMock.Setup(x => x.GenerateJwtToken(user))
                .Returns("jwt-token");

            // Act
            var result = await _controller.Login(loginDto);

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            okResult.Value.Should().BeEquivalentTo(new
            {
                token = "jwt-token"
            });
        }

        [Fact]
        public async Task Login_InvalidCredentials_ReturnsUnauthorized()
        {
            // Arrange
            var loginDto = new LogInUserDTO
            {
                Email = "test@example.com",
                Password = "WrongPassword"
            };
            _userManagerMock.Setup(x => x.FindByEmailAsync(loginDto.Email))
                .ReturnsAsync((AppUser)null);

            // Act
            var result = await _controller.Login(loginDto);

            // Assert
            result.Should().BeOfType<UnauthorizedResult>();
        }

        [Fact]
        public async Task ForgotPassword_ValidEmail_SendsResetLink()
        {
            // Arrange
            var forgotPasswordDto = new ForgotPasswordDTO { Email = "ramyy@gmail.com" };
            var user = new AppUser { Email = forgotPasswordDto.Email };

            _userManagerMock.Setup(x => x.FindByEmailAsync(forgotPasswordDto.Email))
                .ReturnsAsync(user);
            _userManagerMock.Setup(x => x.GeneratePasswordResetTokenAsync(user))
                .ReturnsAsync("reset-token");
            _emailServiceMock.Setup(x => x.SendEmail(It.IsAny<Message>()));

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Scheme = "https";

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = httpContext
            };

            var urlHelperMock = new Mock<IUrlHelper>();
            urlHelperMock
                .Setup(x => x.Action(It.IsAny<UrlActionContext>()))
                .Returns("http://localhost/reset-password-link");
            _controller.Url = urlHelperMock.Object;

            // Act
            var result = await _controller.ForgotPassword(forgotPasswordDto);

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;

            var expectedResponse = new Response(
                "Success",
                "Password reset link sent to ramyy@gmail.com. Please check your email."
            );

            okResult.Value.Should().BeEquivalentTo(expectedResponse);
        }


        [Fact]
        public async Task ResetPassword_ValidInput_ResetsPassword()
        {
            // Arrange
            var resetPasswordDto = new ResetPasswordDTO
            {
                Email = "test@example.com",
                Token = "reset-token",
                NewPassword = "NewPassword123!"
            };
            var user = new AppUser { Email = resetPasswordDto.Email };
            _userManagerMock.Setup(x => x.FindByEmailAsync(resetPasswordDto.Email))
                .ReturnsAsync(user);
            _userManagerMock.Setup(x => x.ResetPasswordAsync(user, resetPasswordDto.Token, resetPasswordDto.NewPassword))
                .ReturnsAsync(IdentityResult.Success);

            // Act
            var result = await _controller.ResetPassword(resetPasswordDto);

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            okResult.Value.Should().BeEquivalentTo(new { message = "Password has been reset successfully." });
        }

        [Fact]
        public async Task ChangePassword_ValidInput_ChangesPassword()
        {
            // Arrange
            var changePasswordDto = new ChangePasswordDto
            {
                CurrentPassword = "OldPassword123!",
                NewPassword = "NewPassword123!"
            };
            var user = new AppUser { Id = "user-id" };
            _userManagerMock.Setup(x => x.FindByIdAsync("user-id"))
                .ReturnsAsync(user);
            _userManagerMock.Setup(x => x.ChangePasswordAsync(user, changePasswordDto.CurrentPassword, changePasswordDto.NewPassword))
                .ReturnsAsync(IdentityResult.Success);

            // Setup controller's User property
            var claims = new[] { new Claim(ClaimTypes.NameIdentifier, "user-id") };
            var identity = new ClaimsIdentity(claims);
            var principal = new ClaimsPrincipal(identity);
            _controller.ControllerContext = new ControllerContext { HttpContext = new DefaultHttpContext { User = principal } };

            // Act
            var result = await _controller.ChangePassword(changePasswordDto);

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            okResult.Value.Should().Be("Password changed successfully");
        }

        [Fact]
        public async Task UpdateProfile_ValidInput_UpdatesProfile()
        {
            // Arrange
            var updateProfileDto = new UpdateProfileDto
            {
                UserName = "newusername",
                Email = "newemail@example.com",
                Address = "123 New St",
                PhoneNumber = "1234567890"
            };
            var user = new AppUser { Id = "user-id" };
            _userManagerMock.Setup(x => x.FindByIdAsync("user-id"))
                .ReturnsAsync(user);
            _userManagerMock.Setup(x => x.UpdateAsync(It.IsAny<AppUser>()))
                .ReturnsAsync(IdentityResult.Success);

            // Setup controller's User property
            var claims = new[] { new Claim(ClaimTypes.NameIdentifier, "user-id") };
            var identity = new ClaimsIdentity(claims);
            var principal = new ClaimsPrincipal(identity);
            _controller.ControllerContext = new ControllerContext { HttpContext = new DefaultHttpContext { User = principal } };

            // Act
            var result = await _controller.UpdateProfile(updateProfileDto);

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            okResult.Value.Should().Be("Profile updated successfully");
            user.UserName.Should().Be(updateProfileDto.UserName);
            user.Email.Should().Be(updateProfileDto.Email);
            user.Address.Should().Be(updateProfileDto.Address);
            user.PhoneNumber.Should().Be(updateProfileDto.PhoneNumber);
        }
    }
}