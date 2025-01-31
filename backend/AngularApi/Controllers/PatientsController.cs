using AngularApi.DTO;
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

        private readonly MedicalCenterDbContext _context;

        public PatientsController(MedicalCenterDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllPatientsWithReviews()
        {
            var patients = await _context.Patients
                .Include(p => p.PatientReview)
                .Select(p => new PatientDTO
                {
                    PatientId = p.Id,
                    Name = p.Name,
                    Email = p.Email,
                    Image = p.Image,
                    Reviews = p.PatientReview
                })
                .ToListAsync();

            return Ok(patients);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<PatientDTO>> GetPatientById(string id)
        {
            var patient = await _context.Patients
                .Where(p => p.Id == id)
                .Select(p => new PatientDTO
                {
                    PatientId = p.Id,
                    Name = p.Name,
                    Email = p.Email,
                    Image = p.Image
                })
                .FirstOrDefaultAsync();

            if (patient == null) return NotFound();

            return Ok(patient);
        }

        [HttpGet("{patientId}/appointments")]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetPatientAppointments(string patientId)
        {
            var appointments = await _context.Appointments
                .Where(a => a.PatientId == patientId)
                .ToListAsync();

            return Ok(appointments);
        }

        [HttpGet("{patientId}/appointments/date-range")]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointmentsByDateRange(string patientId, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var appointments = await _context.Appointments
                .Where(a => a.PatientId == patientId && a.AppointmentTakenDate >= startDate && a.AppointmentTakenDate <= endDate)
                .ToListAsync();

            if (appointments == null ) return NotFound();

            return Ok(appointments);
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

        [HttpDelete("{patientId}/appointments/{appointmentId}")]
        public async Task<IActionResult> DeleteAppointment(string patientId, int appointmentId)
        {
            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(a => a.Id == appointmentId && a.PatientId == patientId);
            if (appointment == null) return NotFound();

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePatient(string id, [FromBody] PatientDTO model)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null) return NotFound();

            patient.Name = model.Name;
            patient.Email = model.Email;
            patient.Image = model.Image;

            _context.Patients.Update(patient);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatient(string id)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null) return NotFound();

            _context.Patients.Remove(patient);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
