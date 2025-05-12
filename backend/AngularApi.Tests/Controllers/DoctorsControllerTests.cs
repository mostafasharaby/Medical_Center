using AngularApi.Controllers;
using AngularApi.DTO;
using AngularApi.Models;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AngularApi.Tests.Controllers
{
    public class DoctorsControllerTests : IDisposable
    {
        private readonly MedicalCenterDbContext _context;
        private readonly DoctorsController _controller;
        private readonly DbContextOptions<MedicalCenterDbContext> _options;

        public DoctorsControllerTests()
        {
            _options = new DbContextOptionsBuilder<MedicalCenterDbContext>()
                      .UseInMemoryDatabase(databaseName: "TestDb")
                      .Options;
            _context = new MedicalCenterDbContext(_options);

            _controller = new DoctorsController(_context);

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };
        }


        [Fact]
        public async Task GetDoctorsWithSpectialization_ReturnsDoctorDtos()
        {
            // Arrange
            _context.Doctors.Add(new Doctor
            {
                Id = "doctor1",
                Name = "Dr. Smith",
                DoctorSpecializations = new List<DoctorSpecialization>
                {
                    new DoctorSpecialization { Specialization = new Specialization { SpecializationName = "Cardiology" } }
                }
            });
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetDoctorsWithSpectialization();

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            var dtos = okResult.Value.Should().BeAssignableTo<List<DoctorDTO>>().Subject;
            dtos.Should().HaveCount(1);
            dtos[0].Name.Should().Be("Dr. Smith");
            dtos[0].Specializations.Should().Contain("Cardiology");
        }

        [Fact]
        public async Task GetDoctor_ExistingId_ReturnsDoctor()
        {
            // Arrange
            var doctor = new Doctor { Id = "doctor1", Name = "Dr. Smith" };
            _context.Doctors.Add(doctor);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetDoctor("doctor1");

            // Assert
            var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
            okResult.Value.Should().BeEquivalentTo(doctor);
        }

        [Fact]
        public async Task GetDoctor_NonExistingId_ReturnsNotFound()
        {

            // Act
            var result = await _controller.GetDoctor("doctor1");

            // Assert
            result.Result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public async Task PostDoctor_ValidInput_CreatesDoctor()
        {
            // Arrange
            var doctor = new Doctor { Id = "doctor1", Name = "Dr. Smith" };

            // Act
            var result = await _controller.PostDoctor(doctor);

            // Assert
            var createdResult = result.Result.Should().BeOfType<CreatedAtActionResult>().Subject;
            var createdDoctor = createdResult.Value.Should().BeAssignableTo<Doctor>().Subject;
            createdDoctor.Id.Should().Be("doctor1");
            var dbDoctor = await _context.Doctors.FindAsync("doctor1");
            dbDoctor.Should().NotBeNull();
        }

        [Fact]
        public async Task GetBookings_ValidDoctorId_ReturnsActiveBookings()
        {
            // Arrange
            _context.Appointments.AddRange(new List<Appointment>
            {
                new Appointment { Id = 1, DoctorId = "doctor1", AppointmentStatus = new AppointmentStatus { Status = AppointmentStatusEnum.Active }, Patient = new Patient { UserName = "Patient1" } },
                new Appointment { Id = 2, DoctorId = "doctor1", AppointmentStatus = new AppointmentStatus { Status = AppointmentStatusEnum.Canceled } }
            });
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetBookings("doctor1");

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            var bookings = okResult.Value.Should().BeAssignableTo<List<Appointment>>().Subject;
            bookings.Should().HaveCount(1);
            bookings[0].Id.Should().Be(1);
        }

        [Fact]
        public async Task GetBookingsByStatus_ValidDoctorIdAndStatus_ReturnsBookings()
        {
            // Arrange
            _context.Appointments.AddRange(new List<Appointment>
            {
                new Appointment { Id = 1, DoctorId = "doctor1", AppointmentStatus = new AppointmentStatus { Status = AppointmentStatusEnum.Active } },
                new Appointment { Id = 2, DoctorId = "doctor1", AppointmentStatus = new AppointmentStatus { Status = AppointmentStatusEnum.Canceled } }
            });
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetBookingsByStatus("doctor1", AppointmentStatusEnum.Canceled);

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            var bookings = okResult.Value.Should().BeAssignableTo<List<Appointment>>().Subject;
            bookings.Should().HaveCount(1);
            bookings[0].Id.Should().Be(2);
        }

        [Fact]
        public async Task GetTodaysBookings_ValidDoctorId_ReturnsTodaysBookings()
        {
            // Arrange
            var today = DateTime.Today;
            _context.Appointments.AddRange(new List<Appointment>
            {
                new Appointment { Id = 1, DoctorId = "doctor1", AppointmentTakenDate = today, AppointmentStatus = new AppointmentStatus { Status = AppointmentStatusEnum.Active }, Patient = new Patient { UserName = "Patient1" } },
                new Appointment { Id = 2, DoctorId = "doctor1", AppointmentTakenDate = today.AddDays(1), AppointmentStatus = new AppointmentStatus { Status = AppointmentStatusEnum.Active } }
            });
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetTodaysBookings("doctor1");

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            var bookings = okResult.Value.Should().BeAssignableTo<List<Appointment>>().Subject;
            bookings.Should().HaveCount(1);
            bookings[0].Id.Should().Be(1);
        }

        [Fact]
        public async Task GetUpComingBookings_ValidDoctorId_ReturnsUpcomingBookings()
        {
            // Arrange
            var today = DateTime.Today;
            _context.Appointments.AddRange(new List<Appointment>
            {
                new Appointment { Id = 1, DoctorId = "doctor1", AppointmentTakenDate = today.AddDays(1), AppointmentStatus = new AppointmentStatus { Status = AppointmentStatusEnum.Active }, Patient = new Patient { UserName = "Patient1" } },
                new Appointment { Id = 2, DoctorId = "doctor1", AppointmentTakenDate = today.AddDays(-1), AppointmentStatus = new AppointmentStatus { Status = AppointmentStatusEnum.Active } }
            });
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetUpComingBookings("doctor1");

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            var bookings = okResult.Value.Should().BeAssignableTo<List<Appointment>>().Subject;
            bookings.Should().HaveCount(1);
            bookings[0].Id.Should().Be(1);
        }

        [Fact]
        public async Task GetLast30DaysBookings_ValidDoctorId_ReturnsLast30DaysBookings()
        {
            // Arrange
            var today = DateTime.Today;
            _context.Appointments.AddRange(new List<Appointment>
            {
                new Appointment { Id = 1, DoctorId = "doctor1", AppointmentTakenDate = today.AddDays(-10), AppointmentStatus = new AppointmentStatus { Status = AppointmentStatusEnum.Active }, Patient = new Patient { UserName = "Patient1" } },
                new Appointment { Id = 2, DoctorId = "doctor1", AppointmentTakenDate = today.AddDays(-40), AppointmentStatus = new AppointmentStatus { Status = AppointmentStatusEnum.Active } }
            });
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetLast30DaysBookings("doctor1");

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            var bookings = okResult.Value.Should().BeAssignableTo<List<Appointment>>().Subject;
            bookings.Should().HaveCount(1);
            bookings[0].Id.Should().Be(1);
        }

        [Fact]
        public async Task GetReviews_ValidDoctorId_ReturnsReviews()
        {
            // Arrange
            _context.PatientReviews.AddRange(new List<PatientReview>
            {
                new PatientReview { Id = 1, DoctorId = "doctor1", Patient = new Patient { UserName = "Patient1" }, OverallRating = 5 },
                new PatientReview { Id = 2, DoctorId = "doctor1", OverallRating = 4 }
            });
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetReviews("doctor1");

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            var reviews = okResult.Value.Should().BeAssignableTo<List<PatientReview>>().Subject;
            reviews.Should().HaveCount(2);
        }

        [Fact]
        public async Task GetRating_ValidDoctorId_ReturnsAverageRating()
        {
            // Arrange
            _context.PatientReviews.AddRange(new List<PatientReview>
            {
                new PatientReview { Id = 1, DoctorId = "doctor1", OverallRating = 5 },
                new PatientReview { Id = 2, DoctorId = "doctor1", OverallRating = 3 }
            });
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetRating("doctor1");

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            var rating = okResult.Value.Should().BeOfType<double>().Subject;
            rating.Should().Be(4.0);
        }

        [Fact]
        public async Task GetQualifications_ValidDoctorId_ReturnsQualifications()
        {
            // Arrange
            _context.DoctorQualifications.AddRange(new List<DoctorQualification>
            {
                new DoctorQualification { Id = 1, DoctorId = "doctor1", QualificationName = "MD" },
                new DoctorQualification { Id = 2, DoctorId = "doctor1", QualificationName = "PhD" }
            });
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetQualifications("doctor1");

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            var qualifications = okResult.Value.Should().BeAssignableTo<List<DoctorQualification>>().Subject;
            qualifications.Should().HaveCount(2);
        }

        [Fact]
        public async Task GetSpecializations_ValidDoctorId_ReturnsSpecializations()
        {
            // Arrange
            _context.DoctorSpecialization.AddRange(new List<DoctorSpecialization>
            {
                new DoctorSpecialization { Id = 1, DoctorId = "doctor1", Specialization = new Specialization { SpecializationName = "Cardiology" } },
                new DoctorSpecialization { Id = 2, DoctorId = "doctor1", Specialization = new Specialization { SpecializationName = "Neurology" } }
            });
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetSpecializations("doctor1");

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            var specializations = okResult.Value.Should().BeAssignableTo<List<DoctorSpecialization>>().Subject;
            specializations.Should().HaveCount(2);
        }


        [Fact]
        public async Task PutDoctor_IdMismatch_ReturnsBadRequest()
        {
            // Arrange
            var doctor = new Doctor { Id = "doctor2" };

            // Act
            var result = await _controller.PutDoctor("doctor1", doctor);

            // Assert
            result.Should().BeOfType<BadRequestResult>();
        }

        [Fact]
        public async Task UpdateBooking_ValidInput_UpdatesBooking()
        {
            // Arrange
            var appointment = new Appointment { Id = 1, AppointmentTakenDate = DateTime.Now, AppointmentStatus = new AppointmentStatus { Status = AppointmentStatusEnum.Active } };
            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();
            var updatedBooking = new Appointment { AppointmentTakenDate = DateTime.Now.AddDays(1), AppointmentStatus = new AppointmentStatus { Status = AppointmentStatusEnum.Canceled } };

            // Act
            var result = await _controller.UpdateBooking(1, updatedBooking);

            // Assert
            result.Should().BeOfType<NoContentResult>();
            var dbAppointment = await _context.Appointments.FindAsync(1);
            dbAppointment.AppointmentTakenDate.Should().Be(updatedBooking.AppointmentTakenDate);
            dbAppointment.AppointmentStatus.Status.Should().Be(AppointmentStatusEnum.Canceled);
        }

        [Fact]
        public async Task DeleteDoctor_ExistingId_DeletesDoctor()
        {
            // Arrange
            var doctor = new Doctor { Id = "doctor1" };
            _context.Doctors.Add(doctor);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.DeleteDoctor("doctor1");

            // Assert
            result.Should().BeOfType<NoContentResult>();
            var dbDoctor = await _context.Doctors.FindAsync("doctor1");
            dbDoctor.Should().BeNull();
        }

        [Fact]
        public async Task DeleteAppointment_ValidDoctorIdAndAppointmentId_CancelsAppointment()
        {
            // Arrange
            var appointment = new Appointment { Id = 1, DoctorId = "doctor1", AppointmentStatus = new AppointmentStatus { Status = AppointmentStatusEnum.Active }, AppointmentStatusId = 1 };
            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.DeleteAppointment("doctor1", 1);

            // Assert
            result.Should().BeOfType<NoContentResult>();
            var dbAppointment = await _context.Appointments.FindAsync(1);
            dbAppointment.AppointmentStatusId.Should().Be((int)AppointmentStatusEnum.Canceled);
        }

        [Fact]
        public async Task DeleteAppointment_NonExistingAppointment_ReturnsNotFound()
        {
            // Arrange
            // No appointments added

            // Act
            var result = await _controller.DeleteAppointment("doctor1", 1);

            // Assert
            var notFoundResult = result.Should().BeOfType<NotFoundObjectResult>().Subject;
            notFoundResult.Value.Should().BeEquivalentTo(new { message = "Appointment not found" });
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }
}