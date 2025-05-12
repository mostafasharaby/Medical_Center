using AngularApi.Controllers;
using AngularApi.DTO;
using AngularApi.Models;
using AngularApi.Services;
using AngularApi.Services.Interfaces;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using System.Security.Claims;

namespace AngularApi.Tests.Controllers
{
    public class AppointmentsControllerTests : IDisposable
    {
        private readonly MedicalCenterDbContext _context;
        private readonly Mock<UserManager<AppUser>> _userManagerMock;
        private readonly Mock<IEmailService> _emailServiceMock;
        private readonly EmailTemplateService _emailTemplateService;
        private readonly AppointmentsController _controller;

        public AppointmentsControllerTests()
        {
            var options = new DbContextOptionsBuilder<MedicalCenterDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            _context = new MedicalCenterDbContext(options);

            var store = new Mock<IUserStore<AppUser>>();
            _userManagerMock = new Mock<UserManager<AppUser>>(store.Object, null, null, null, null, null, null, null, null);

            _emailServiceMock = new Mock<IEmailService>();

            _controller = new AppointmentsController(
                _context,
                _userManagerMock.Object,
                _emailServiceMock.Object,
                _emailTemplateService);

            var claims = new[] { new Claim(ClaimTypes.NameIdentifier, "user-id") };
            var identity = new ClaimsIdentity(claims);
            var principal = new ClaimsPrincipal(identity);
            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = principal }
            };

            var serviceProviderMock = new Mock<IServiceProvider>();
            serviceProviderMock.Setup(sp => sp.GetService(typeof(EmailTemplateService)))
                .Returns(_emailTemplateService);
            _controller.ControllerContext.HttpContext.RequestServices = serviceProviderMock.Object;
        }



        [Fact]
        public async Task GetAllAppointments_ReturnsAppointmentDtos()
        {
            // Arrange
            var doctor = new Doctor
            {
                Id = "doctor1",
                Name = "Dr. Smith",
                DoctorSpecializations = new List<DoctorSpecialization>
                {
                    new DoctorSpecialization { Specialization = new Specialization { SpecializationName = "Cardiology" } }
                }
            };
            _context.Doctors.Add(doctor);
            _context.Appointments.Add(new Appointment
            {
                Id = 1,
                AppointmentTakenDate = DateTime.Now,
                DoctorName = "Dr. Smith",
                DoctorId = "doctor1",
                Patient = new Patient { Id = "patient1", UserName = "Patient1", Email = "patient1@example.com" }
            });
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetAllAppointments();

            // Assert
            var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
            var dtos = okResult.Value.Should().BeAssignableTo<List<AppointmentDTO>>().Subject;
            dtos.Should().HaveCount(1);
            dtos[0].Doctor.Specializations.Should().Contain("Cardiology");
            dtos[0].Patient.Name.Should().Be("Patient1");
        }


        [Fact]
        public async Task GetAppointment_NonExistingId_ReturnsNotFound()
        {

            // Act
            var result = await _controller.GetAppointment(1);

            // Assert
            result.Result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public async Task UpdateAppointment_ValidInput_UpdatesAppointment()
        {
            // Arrange
            var appointment = new Appointment { Id = 1, AppointmentTakenDate = DateTime.Now };
            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();
            var appointmentDto = new UpdateAppointmentDTO { Id = 1, AppointmentTakenDate = DateTime.Now.AddDays(1) };

            // Act
            var result = await _controller.UpdateAppointment(1, appointmentDto);

            // Assert
            result.Should().BeOfType<NoContentResult>();
            var updatedAppointment = await _context.Appointments.FindAsync(1);
            updatedAppointment.AppointmentTakenDate.Should().Be(appointmentDto.AppointmentTakenDate);
        }

        [Fact]
        public async Task UpdateAppointment_IdMismatch_ReturnsBadRequest()
        {
            // Arrange
            var appointmentDto = new UpdateAppointmentDTO { Id = 2 };

            // Act
            var result = await _controller.UpdateAppointment(1, appointmentDto);

            // Assert
            var badRequestResult = result.Should().BeOfType<BadRequestObjectResult>().Subject;
            badRequestResult.Value.Should().Be("Appointment ID mismatch.");
        }


        [Fact]
        public async Task PostAppointment_InvalidDoctorName_ReturnsBadRequest()
        {
            // Arrange
            var appointment = new Appointment { Id = 1, DoctorName = "InvalidDoctor" };

            // Act
            var result = await _controller.PostAppointment(appointment);

            // Assert
            var badRequestResult = result.Result.Should().BeOfType<BadRequestObjectResult>().Subject;
            badRequestResult.Value.Should().Be("Invalid DoctorName");
        }

        [Fact]
        public async Task PostAppointment_UserNotFound_ReturnsNotFound()
        {
            // Arrange
            var appointment = new Appointment { Id = 1, DoctorName = "Dr. Smith" };
            var doctor = new Doctor { Id = "doctor-id", Name = "Dr. Smith" };
            _context.Doctors.Add(doctor);
            await _context.SaveChangesAsync();
            _userManagerMock.Setup(x => x.FindByIdAsync("user-id")).ReturnsAsync((AppUser)null);

            // Act
            var result = await _controller.PostAppointment(appointment);

            // Assert
            var notFoundResult = result.Result.Should().BeOfType<NotFoundObjectResult>().Subject;
            notFoundResult.Value.Should().Be("User not found");
        }

        [Fact]
        public async Task DeleteAppointment_ExistingId_DeletesAppointment()
        {
            // Arrange
            var appointment = new Appointment { Id = 1 };
            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.DeleteAppointment(1);

            // Assert
            result.Should().BeOfType<NoContentResult>();
            var deletedAppointment = await _context.Appointments.FindAsync(1);
            deletedAppointment.Should().BeNull();
        }

        [Fact]
        public async Task DeleteAppointment_NonExistingId_ReturnsNotFound()
        {


            // Act
            var result = await _controller.DeleteAppointment(1);

            // Assert
            result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public async Task GetAppointmentsByPatient_ReturnsPatientAppointments()
        {
            // Arrange
            _context.Appointments.AddRange(new List<Appointment>
            {
                new Appointment { Id = 1, PatientId = "patient1" },
                new Appointment { Id = 2, PatientId = "patient1" },
                new Appointment { Id = 3, PatientId = "patient2" }
            });
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetAppointmentsByPatient("patient1");

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            var returnedAppointments = okResult.Value.Should().BeAssignableTo<List<Appointment>>().Subject;
            returnedAppointments.Should().HaveCount(2);
            returnedAppointments.All(a => a.PatientId == "patient1").Should().BeTrue();
        }

        [Fact]
        public async Task GetTodaysAppointments_ReturnsTodaysAppointments()
        {
            // Arrange
            var today = DateTime.Today;
            _context.Appointments.AddRange(new List<Appointment>
            {
                new Appointment { Id = 1, ProbableStartTime = today },
                new Appointment { Id = 2, ProbableStartTime = today.AddDays(1) }
            });
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetTodaysAppointments();

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            var returnedAppointments = okResult.Value.Should().BeAssignableTo<List<Appointment>>().Subject;
            returnedAppointments.Should().HaveCount(1);
            returnedAppointments[0].Id.Should().Be(1);
        }

        [Fact]
        public async Task GetTotalEarnings_ReturnsSumOfAmounts()
        {
            // Arrange
            _context.Appointments.AddRange(new List<Appointment>
            {
                new Appointment { Id = 1, Amount = 30 },
                new Appointment { Id = 2, Amount = 50 }
            });
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetPatientTotalEarnings();

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }
}