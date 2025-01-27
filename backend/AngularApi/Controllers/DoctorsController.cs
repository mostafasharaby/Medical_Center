using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AngularApi.Models;
using AngularApi.DTO;
using Microsoft.AspNetCore.Authorization;

namespace AngularApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
  //  [Authorize(Roles = "doctor")]
    public class DoctorsController : ControllerBase
    {
        private readonly MedicalCenterDbContext _context;

        public DoctorsController(MedicalCenterDbContext context)
        {
            _context = context;
        }

        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Doctor>>> GetDoctors()
        {
            return await _context.Doctors.Include(i => i.DoctorSpecializations).ThenInclude(i => i.Specialization).ToListAsync();
        }

        [HttpGet("/api/DoctorsWithSpectialization")]
        public async Task<IActionResult> GetDoctorsWithSpectialization()
        {
            var doctors = await _context.Doctors
                .Include(d => d.DoctorSpecializations)
                .ThenInclude(ds => ds.Specialization)
                .ToListAsync();

            var doctorDTOs = doctors.Select(d => new DoctorDTO
            {
                Id = d.Id,
                Name = d.Name,
                Image = d.Image,
                ProfessionalStatement = d.ProfessionalStatement,
                PracticingFrom = d.PracticingFrom,
                Specializations = d.DoctorSpecializations.Select(ds => ds.Specialization.SpecializationName).ToList()
            }).ToList();

            return Ok(doctorDTOs);
        }

        
        [HttpGet("{doctorId}")]
        public async Task<ActionResult<Doctor>> GetDoctor(int doctorId)
        {
            var doctor = await _context.Doctors.FindAsync(doctorId);

            if (doctor == null)
            {
                return NotFound();
            }

            return doctor;
        }

          
        [HttpPost]
        public async Task<ActionResult<Doctor>> PostDoctor(Doctor doctor)
        {
            _context.Doctors.Add(doctor);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDoctor", new { id = doctor.Id }, doctor);
        }


        [HttpGet("{doctorId}/bookings")]
        public async Task<IActionResult> GetBookings(string doctorId)
        {
            var bookings = await _context.Appointments
                .Include(a => a.Patient)  
                .Where(a => a.DoctorId == doctorId &&
                            a.AppointmentStatus!.Status != AppointmentStatusEnum.Canceled) 
                .ToListAsync();

            return Ok(bookings);
        }

        [HttpGet("{doctorId}/bookings/status/{status}")]
        public async Task<IActionResult> GetBookingsByStatus(int doctorId, AppointmentStatusEnum status)
        {
            var bookings = await _context.AppointmentStatus
                .Where(a => a.Id == doctorId && a.Status == status)
                .ToListAsync();
            return Ok(bookings);
        }    

        [HttpGet("{doctorId}/bookings/today")]
        public async Task<IActionResult> GetTodaysBookings(int doctorId)
        {
            var today = DateTime.Today;
            var bookings = await _context.Appointments
                .Where(a => a.Id == doctorId && a.AppointmentTakenDate == today && a.AppointmentStatus!.Status != AppointmentStatusEnum.Canceled)
                .ToListAsync();
            return Ok(bookings);
        }


        [HttpGet("{doctorId}/reviews")]
        public async Task<IActionResult> GetReviews(string doctorId)
        {
            var reviews = await _context.PatientReviews
                .Where(r => r.DoctorId == doctorId)
                .ToListAsync();
            return Ok(reviews);
        }

        
        [HttpGet("{doctorId}/rating")]
        public async Task<IActionResult> GetRating(string doctorId)
        {
            var rating = await _context.PatientReviews
                .Where(r => r.DoctorId == doctorId)
                .AverageAsync(r => r.OverallRating);
            return Ok(rating);
        }

        
        [HttpGet("{doctorId}/qualifications")]
        public async Task<IActionResult> GetQualifications(string doctorId)
        {
            var qualifications = await _context.DoctorQualifications
                .Where(q => q.DoctorId == doctorId)
                .ToListAsync();
            return Ok(qualifications);
        }


        [HttpGet("{doctorId}/specializations")]
        public async Task<IActionResult> GetSpecializations(string doctorId)
        {
            var specializations = await _context.DoctorSpecialization.Include(i=>i.Specialization)
                .Where(s => s.DoctorId == doctorId)
                .ToListAsync();
            return Ok(specializations);
        }

       
        //[HttpGet("{doctorId}/schedules")]
        //public async Task<IActionResult> GetSchedules(int doctorId)
        //{
        //    var schedules = await _context.Schedules
        //        .Where(s => s.Id == doctorId)
        //        .ToListAsync();
        //    return Ok(schedules);
        //}

        [HttpPut("{doctorId}")]
        public async Task<IActionResult> PutDoctor(string id, Doctor doctor)
        {
            if (id != doctor.Id)
            {
                return BadRequest();
            }

            _context.Entry(doctor).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DoctorExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }
        

        [HttpPut("bookings/{bookingId}")]
        public async Task<IActionResult> UpdateBooking(int bookingId, [FromBody] Appointment updatedBooking)
        {
            var booking = await _context.Appointments.FindAsync(bookingId);
            if (booking == null) return NotFound();

            // Update fields
            booking.AppointmentStatus = updatedBooking.AppointmentStatus;
            booking.AppointmentTakenDate = updatedBooking.AppointmentTakenDate;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Doctors/5
        [HttpDelete("{doctorId}")]
        public async Task<IActionResult> DeleteDoctor(int id)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null)
            {
                return NotFound();
            }

            _context.Doctors.Remove(doctor);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{doctorId}/appointments/{appointmentId}")]
        public async Task<IActionResult> DeleteAppointment(string doctorId, int appointmentId)
        {
            var appointment = await _context.Appointments
                                             .Where(a => a.DoctorId == doctorId && a.Id == appointmentId)
                                             .FirstOrDefaultAsync();

            if (appointment == null)
            {
                return NotFound(new { message = "Appointment not found" });
            }

            //_context.Appointments.Remove(appointment);
            _context.AppointmentStatus.Where(i=>i.Status == AppointmentStatusEnum.Canceled) ;
            await _context.SaveChangesAsync();           
            return NoContent(); 
        }


        private bool DoctorExists(string id)
        {
            return _context.Doctors.Any(e => e.Id == id);
        }
    }
}
