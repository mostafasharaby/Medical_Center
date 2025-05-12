using AngularApi.Controllers;
using AngularApi.Models;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AngularApi.Tests.Controllers
{
    public class SpecializationsControllerTests : IDisposable
    {
        private readonly MedicalCenterDbContext _context;
        private readonly SpecializationsController _controller;

        public SpecializationsControllerTests()
        {
            var options = new DbContextOptionsBuilder<MedicalCenterDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            _context = new MedicalCenterDbContext(options);

            _controller = new SpecializationsController(_context);

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };
        }

        [Fact]
        public async Task GetSpecializations_ReturnsAllSpecializations()
        {
            // Arrange
            _context.Specializations.AddRange(new List<Specialization>
            {
                new Specialization
                {
                    Id = 1,
                    SpecializationName = "Cardiology",
                    Services = new List<Service> { new Service { Id = 1, Name = "Heart Checkup" } }
                },
                new Specialization { Id = 2, SpecializationName = "Neurology" }
            });
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetSpecializations();

            // Assert
            var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
            var specializations = okResult.Value.Should().BeAssignableTo<List<Specialization>>().Subject;
            specializations.Should().HaveCount(2);
            specializations[0].SpecializationName.Should().Be("Cardiology");
            specializations[0].Services.Should().HaveCount(1);
            specializations[1].SpecializationName.Should().Be("Neurology");
            specializations[1].Services.Should().BeNullOrEmpty();
        }

        [Fact]
        public async Task GetSpecialization_NonExistingId_ReturnsNotFound()
        {
            // Act
            var result = await _controller.GetSpecialization(1);

            // Assert
            result.Result.Should().BeOfType<NotFoundResult>();
        }


        [Fact]
        public async Task PutSpecialization_IdMismatch_ReturnsBadRequest()
        {
            // Arrange
            var specialization = new Specialization { Id = 2, SpecializationName = "Neurology" };

            // Act
            var result = await _controller.PutSpecialization(1, specialization);

            // Assert
            result.Should().BeOfType<BadRequestResult>();
        }

        [Fact]
        public async Task PutSpecialization_NonExistingId_ReturnsNotFound()
        {
            // Arrange
            var specialization = new Specialization { Id = 1, SpecializationName = "Cardiology" };

            // Act
            var result = await _controller.PutSpecialization(1, specialization);

            // Assert
            result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public async Task PostSpecialization_ValidInput_CreatesSpecialization()
        {
            // Arrange
            var specialization = new Specialization { Id = 1, SpecializationName = "Cardiology" };

            // Act
            var result = await _controller.PostSpecialization(specialization);

            // Assert
            var createdResult = result.Result.Should().BeOfType<CreatedAtActionResult>().Subject;
            var createdSpecialization = createdResult.Value.Should().BeAssignableTo<Specialization>().Subject;
            createdSpecialization.Id.Should().Be(1);
            createdSpecialization.SpecializationName.Should().Be("Cardiology");
            var dbSpecialization = await _context.Specializations.FindAsync(1);
            dbSpecialization.Should().NotBeNull();
        }

        [Fact]
        public async Task DeleteSpecialization_ExistingId_DeletesSpecialization()
        {
            // Arrange
            var specialization = new Specialization { Id = 1, SpecializationName = "Cardiology" };
            _context.Specializations.Add(specialization);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.DeleteSpecialization(1);

            // Assert
            result.Should().BeOfType<NoContentResult>();
            var dbSpecialization = await _context.Specializations.FindAsync(1);
            dbSpecialization.Should().BeNull();
        }

        [Fact]
        public async Task DeleteSpecialization_NonExistingId_ReturnsNotFound()
        {
            // Arrange
            // No specializations added

            // Act
            var result = await _controller.DeleteSpecialization(1);

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