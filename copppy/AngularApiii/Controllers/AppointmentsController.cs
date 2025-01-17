using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AngularApi.Models;

namespace AngularApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentsController : ControllerBase
    {
        private readonly MedicalCenterDbContext _context;

        public AppointmentsController(MedicalCenterDbContext context)
        {
            _context = context;
        }

        // GET: api/Appointments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointments()
        {
            return await _context.Appointments.ToListAsync();
        }

        // GET: api/Appointments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Appointment>> GetAppointment(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);

            if (appointment == null)
            {
                return NotFound();
            }

            return appointment;
        }

       
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAppointment(int id, Appointment appointment)
        {
            if (id != appointment.Id)
            {
                return BadRequest();
            }

            _context.Entry(appointment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AppointmentExists(id))
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
       
        [HttpPost]
        public async Task<ActionResult<Appointment>> PostAppointment(Appointment appointment)
        {
            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAppointment", new { id = appointment.Id }, appointment);
        }

        // DELETE: api/Appointments/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
            {
                return NotFound();
            }

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("patient/{patientId}")]
        public async Task<IActionResult> GetAppointmentsByPatient(string patientId)
        {
            var appointments = await _context.Appointments
                .Where(a => a.PatientId == patientId)
                .ToListAsync();
            return Ok(appointments);
        }

        [HttpGet("date/{date}")]
        public async Task<IActionResult> GetAppointmentsByDate(DateTime date)
        {
            var appointments = await _context.Appointments
                .Where(a => a.ProbableStartTime.Value.Date == date.Date)
                .ToListAsync();
            return Ok(appointments);
        }

        [HttpGet("status/{status}")]
        public async Task<IActionResult> GetAppointmentsByStatus(AppointmentStatusEnum status)
        {
            var appointments = await _context.Appointments
                .Where(a => a.AppointmentStatus!.Status == status)
                .ToListAsync();
            return Ok(appointments);
        }

        [HttpGet("today")]
        public async Task<IActionResult> GetTodaysAppointments()
        {
            var today = DateTime.Today;
            var appointments = await _context.Appointments
                .Where(a => a.ProbableStartTime!.Value.Date == today)
                .ToListAsync();
            return Ok(appointments);
        }


        [HttpGet("upcoming")]
        public async Task<IActionResult> GetUpcomingAppointments()
        {
            var now = DateTime.Now;
            var appointments = await _context.Appointments
                .Where(a => a.ProbableStartTime > now)
                .OrderBy(a => a.ProbableStartTime)
                .ToListAsync();
            return Ok(appointments);
        }

        [HttpGet("patient/{patientId}/status/{status}")]
        public async Task<IActionResult> GetAppointmentsByPatientAndStatus(string patientId, AppointmentStatusEnum status)
        {
            var appointments = await _context.Appointments
                .Where(a => a.PatientId == patientId && a.AppointmentStatus!.Status == status)
                .ToListAsync();
            return Ok(appointments);
        }

        [HttpGet("patient/{patientId}/history")]
        public async Task<IActionResult> GetAppointmentHistoryByPatient(string patientId)
        {
            var appointments = await _context.Appointments
                .Where(a => a.PatientId == patientId)
                .OrderByDescending(a => a.ProbableStartTime)
                .ToListAsync();
            return Ok(appointments);
        }


        private bool AppointmentExists(int id)
        {
            return _context.Appointments.Any(e => e.Id == id);
        }
    }
}
