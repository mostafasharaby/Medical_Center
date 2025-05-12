using AngularApi.Controllers;
using AngularApi.Models;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AngularApi.Tests.Controllers
{
    public class PatientReviewsControllerTests : IDisposable
    {
        private readonly MedicalCenterDbContext _context;
        private readonly PatientReviewsController _controller;

        public PatientReviewsControllerTests()
        {
            var options = new DbContextOptionsBuilder<MedicalCenterDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            _context = new MedicalCenterDbContext(options);

            _controller = new PatientReviewsController(_context);

            // Setup HttpContext for consistency
            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };
        }

        [Fact]
        public async Task GetPatientReviews_ReturnsAllReviews()
        {
            // Arrange
            _context.PatientReviews.AddRange(new List<PatientReview>
            {
                new PatientReview { Id = 1, PatientId = "patient1", OverallRating = 5, Patient = new Patient { Id = "patient1", Name = "John Doe" } },
                new PatientReview { Id = 2, PatientId = "patient2", OverallRating = 4, Patient = new Patient { Id = "patient2", Name = "Jane Smith" } }
            });
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetPatientReviews();

            // Assert
            var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
            var reviews = okResult.Value.Should().BeAssignableTo<List<PatientReview>>().Subject;
            reviews.Should().HaveCount(2);
            reviews[0].Patient.Should().NotBeNull();
            reviews[0].Patient.Name.Should().Be("John Doe");
        }

        [Fact]
        public async Task GetPatientReview_ExistingId_ReturnsReview()
        {
            // Arrange
            var review = new PatientReview { Id = 1, PatientId = "patient1", OverallRating = 5 };
            _context.PatientReviews.Add(review);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetPatientReview(1);

            // Assert
            var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
            var returnedReview = okResult.Value.Should().BeAssignableTo<PatientReview>().Subject;
            returnedReview.Id.Should().Be(1);
            returnedReview.OverallRating.Should().Be(5);
        }

        [Fact]
        public async Task GetPatientReview_NonExistingId_ReturnsNotFound()
        {
            // Act
            var result = await _controller.GetPatientReview(1);

            // Assert
            result.Result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public async Task PutPatientReview_IdMismatch_ReturnsBadRequest()
        {
            // Arrange
            var review = new PatientReview { Id = 2, PatientId = "patient1" };

            // Act
            var result = await _controller.PutPatientReview(1, review);

            // Assert
            result.Should().BeOfType<BadRequestResult>();
        }

        [Fact]
        public async Task PutPatientReview_NonExistingId_ReturnsNotFound()
        {
            // Arrange
            var review = new PatientReview { Id = 1, PatientId = "patient1" };

            // Act
            var result = await _controller.PutPatientReview(1, review);

            // Assert
            result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public async Task PostPatientReview_ValidInput_CreatesReview()
        {
            // Arrange
            var review = new PatientReview { Id = 1, PatientId = "patient1", OverallRating = 5 };

            // Act
            var result = await _controller.PostPatientReview(review);

            // Assert
            var createdResult = result.Result.Should().BeOfType<CreatedAtActionResult>().Subject;
            var createdReview = createdResult.Value.Should().BeAssignableTo<PatientReview>().Subject;
            createdReview.Id.Should().Be(1);
            createdReview.OverallRating.Should().Be(5);
            var dbReview = await _context.PatientReviews.FindAsync(1);
            dbReview.Should().NotBeNull();
        }

        [Fact]
        public async Task DeletePatientReview_ExistingId_DeletesReview()
        {
            // Arrange
            var review = new PatientReview { Id = 1, PatientId = "patient1" };
            _context.PatientReviews.Add(review);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.DeletePatientReview(1);

            // Assert
            result.Should().BeOfType<NoContentResult>();
            var dbReview = await _context.PatientReviews.FindAsync(1);
            dbReview.Should().BeNull();
        }

        [Fact]
        public async Task DeletePatientReview_NonExistingId_ReturnsNotFound()
        {
            // Arrange

            // Act
            var result = await _controller.DeletePatientReview(1);

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