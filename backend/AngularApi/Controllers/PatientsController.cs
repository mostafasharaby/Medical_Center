using AngularApi.Models;
using Hotel_Backend.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AngularApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientsController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly MedicalCenterDbContext _context;

        public PatientsController(UserManager<IdentityUser> userManager, MedicalCenterDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPatientById(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound();

            return Ok(new
            {
                user.Email,
                user.UserName,
                user.PhoneNumber
            });
        }

       
        [HttpGet]
        public async Task<IActionResult> GetAllPatients()
        {
            var patients = await _userManager.Users
                .Select(user => new
                {
                    user.Id,
                    user.Email                  
                })
                .ToListAsync();

            return Ok(patients);
        }
        

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePatient(string id, [FromBody] UpdateProfileDto model)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound();

            user.Email = model.Email;

            var result = await _userManager.UpdateAsync(user);
            if (result.Succeeded) return NoContent();

            return BadRequest(result.Errors);
        }


        [HttpPut("{patientId}/reviews/{reviewId}")]
        public async Task<IActionResult> UpdateReview(string patientId, int reviewId, [FromBody] PatientReview review)
        {
            if (patientId != review.PatientId || reviewId != review.Id)
            {
                return BadRequest("Patient ID or Review ID mismatch.");
            }
            _context.Entry(review).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("{id}/appointments")]
        public async Task<IActionResult> CreateAppointment(string id, [FromBody] Appointment appointment)
        {
            if (id != appointment.PatientId)
            {
                return BadRequest("Patient ID mismatch.");
            }
            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetPatientById), new { id = appointment.Id }, appointment);
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatient(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound();

            // Soft delete or deactivate user
            user.LockoutEnd = DateTimeOffset.MaxValue;
            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded) return NoContent();

            return BadRequest(result.Errors);
        }

        [HttpDelete("{patientId}/appointments/{appointmentId}")]
        public async Task<IActionResult> DeleteAppointment(string patientId, int appointmentId)
        {
            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(a => a.Id == appointmentId && a.PatientId == patientId);
            if (appointment == null)
            {
                return NotFound();
            }
            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();
            return NoContent();
        }

    }
}
