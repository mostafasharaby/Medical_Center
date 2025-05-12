using AngularApi.Controllers;
using AngularApi.DTO;
using AngularApi.Models;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AngularApi.Tests.Controllers
{
    public class PatientsControllerTests : IDisposable
    {
        private readonly MedicalCenterDbContext _context;
        private readonly PatientsController _controller;

        public PatientsControllerTests()
        {
            var options = new DbContextOptionsBuilder<MedicalCenterDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            _context = new MedicalCenterDbContext(options);

            _controller = new PatientsController(_context);

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };
        }



        [Fact]
        public async Task GetPatientById_ExistingId_ReturnsPatientDto()
        {
            // Arrange
            var patient = new Patient { Id = "patient1", Name = "John Doe", Email = "john@example.com", Image = "image.jpg" };
            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetPatientById("patient1");

            // Assert
            var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
            var patientDto = okResult.Value.Should().BeAssignableTo<PatientDTO>().Subject;
            patientDto.PatientId.Should().Be("patient1");
            patientDto.Name.Should().Be("John Doe");
            patientDto.Email.Should().Be("john@example.com");
            patientDto.Image.Should().Be("image.jpg");
        }

        [Fact]
        public async Task GetPatientById_NonExistingId_ReturnsNotFound()
        {
            // Arrange
            // No patients added

            // Act
            var result = await _controller.GetPatientById("patient1");

            // Assert
            result.Result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public async Task GetPatientAppointments_ValidPatientId_ReturnsAppointments()
        {
            // Arrange
            _context.Appointments.AddRange(new List<Appointment>
            {
                new Appointment { Id = 1, PatientId = "patient1", AppointmentTakenDate = DateTime.Now },
                new Appointment { Id = 2, PatientId = "patient1", AppointmentTakenDate = DateTime.Now },
                new Appointment { Id = 3, PatientId = "patient2", AppointmentTakenDate = DateTime.Now }
            });
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetPatientAppointments("patient1");

            // Assert
            var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
            var appointments = okResult.Value.Should().BeAssignableTo<List<Appointment>>().Subject;
            appointments.Should().HaveCount(2);
            appointments.All(a => a.PatientId == "patient1").Should().BeTrue();
        }

        [Fact]
        public async Task GetAppointmentsByDateRange_ValidPatientIdAndDates_ReturnsAppointments()
        {
            // Arrange
            var startDate = DateTime.Today;
            var endDate = DateTime.Today.AddDays(2);
            _context.Appointments.AddRange(new List<Appointment>
            {
                new Appointment { Id = 1, PatientId = "patient1", AppointmentTakenDate = startDate },
                new Appointment { Id = 2, PatientId = "patient1", AppointmentTakenDate = startDate.AddDays(1) },
                new Appointment { Id = 3, PatientId = "patient1", AppointmentTakenDate = startDate.AddDays(3) }
            });
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetAppointmentsByDateRange("patient1", startDate, endDate);

            // Assert
            var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
            var appointments = okResult.Value.Should().BeAssignableTo<List<Appointment>>().Subject;
            appointments.Should().HaveCount(2);
            appointments.All(a => a.AppointmentTakenDate >= startDate && a.AppointmentTakenDate <= endDate).Should().BeTrue();
        }

        [Fact]
        public async Task GetAppointmentsByDateRange_NoAppointments_ReturnsEmptyList()
        {
            // Arrange
            var startDate = DateTime.Today;
            var endDate = DateTime.Today.AddDays(2);
            // No appointments added

            // Act
            var result = await _controller.GetAppointmentsByDateRange("patient1", startDate, endDate);

            // Assert
            var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
            var appointments = okResult.Value.Should().BeAssignableTo<List<Appointment>>().Subject;
            appointments.Should().BeEmpty();
        }



        [Fact]
        public async Task UpdateReview_IdMismatch_ReturnsBadRequest()
        {
            // Arrange
            var review = new PatientReview { Id = 2, PatientId = "patient2" };

            // Act
            var result = await _controller.UpdateReview("patient1", 1, review);

            // Assert
            var badRequestResult = result.Should().BeOfType<BadRequestObjectResult>().Subject;
            badRequestResult.Value.Should().Be("Patient ID or Review ID mismatch.");
        }

        [Fact]
        public async Task DeleteAppointment_ValidPatientIdAndAppointmentId_DeletesAppointment()
        {
            // Arrange
            var appointment = new Appointment { Id = 1, PatientId = "patient1", AppointmentTakenDate = DateTime.Now };
            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.DeleteAppointment("patient1", 1);

            // Assert
            result.Should().BeOfType<NoContentResult>();
            var dbAppointment = await _context.Appointments.FindAsync(1);
            dbAppointment.Should().BeNull();
        }

        [Fact]
        public async Task DeleteAppointment_NonExistingAppointment_ReturnsNotFound()
        {
            // Arrange
            // No appointments added

            // Act
            var result = await _controller.DeleteAppointment("patient1", 1);

            // Assert
            result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public async Task UpdatePatient_ValidInput_UpdatesPatient()
        {
            // Arrange
            var patient = new Patient { Id = "patient1", Name = "John Doe", Email = "john@example.com", Image = "old.jpg" };
            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();
            var patientDto = new PatientDTO { PatientId = "patient1", Name = "John Updated", Email = "john.updated@example.com", Image = "new.jpg" };

            // Act
            var result = await _controller.UpdatePatient("patient1", patientDto);

            // Assert
            result.Should().BeOfType<NoContentResult>();
            var dbPatient = await _context.Patients.FindAsync("patient1");
            dbPatient.Name.Should().Be("John Updated");
            dbPatient.Email.Should().Be("john.updated@example.com");
            dbPatient.Image.Should().Be("new.jpg");
        }

        [Fact]
        public async Task UpdatePatient_NonExistingPatient_ReturnsNotFound()
        {
            // Arrange
            var patientDto = new PatientDTO { PatientId = "patient1", Name = "John Updated" };

            // Act
            var result = await _controller.UpdatePatient("patient1", patientDto);

            // Assert
            result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public async Task DeletePatient_ExistingId_DeletesPatient()
        {
            // Arrange
            var patient = new Patient { Id = "patient1", Name = "John Doe" };
            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.DeletePatient("patient1");

            // Assert
            result.Should().BeOfType<NoContentResult>();
            var dbPatient = await _context.Patients.FindAsync("patient1");
            dbPatient.Should().BeNull();
        }

        [Fact]
        public async Task DeletePatient_NonExistingId_ReturnsNotFound()
        {
            // Arrange
            // No patients added

            // Act
            var result = await _controller.DeletePatient("patient1");

            // Assert
            result.Should().BeOfType<NotFoundResult>();
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }
}