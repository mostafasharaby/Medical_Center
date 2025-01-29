using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AngularApi.Models;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using AngularApi.DTO;

namespace AngularApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentsController : ControllerBase
    {
        private readonly MedicalCenterDbContext _context;
        private readonly UserManager<AppUser> userManager;

        public AppointmentsController(MedicalCenterDbContext context , UserManager<AppUser> _userManager)
        {
            userManager = _userManager;
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointments()
        {
            return await _context.Appointments.Include(i=>i.Patient).ToListAsync();
        }

        [HttpGet("GetAllAppointments")]
        public async Task<ActionResult<IEnumerable<AppointmentDTO>>> GetAllAppointments()
        {
            var appointments = await _context.Appointments
                .Include(a => a.Doctor)
                    .ThenInclude(d => d.DoctorSpecializations)!
                        .ThenInclude(ds => ds.Specialization)
                .Include(a => a.Patient)
                .ToListAsync();

            var appointmentDtos = appointments.Select(appointment => new AppointmentDTO
            {
                AppointmentId = appointment.Id,
                AppointmentDate = appointment.AppointmentTakenDate,
                Doctor = new DoctorDTO
                {
                    Name = appointment.DoctorName,
                    Specializations = appointment.Doctor?.DoctorSpecializations
                        .Select(ds => ds.Specialization?.SpecializationName)
                        .ToList() ?? new List<string>()
                },
                Patient = new PatientDTO
                {
                    PatientId = appointment.PatientId.ToString(),
                    Name = appointment.Patient?.UserName,
                    Email = appointment.Patient?.Email,
                }
            }).ToList();

            return Ok(appointmentDtos);
        }



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

       
        //[HttpPut("{id}")]
        //public async Task<IActionResult> PutAppointment(int id, Appointment appointment)
        //{
        //    if (id != appointment.Id)
        //    {
        //        return BadRequest();
        //    }

        //    _context.Entry(appointment).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!AppointmentExists(id))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return NoContent();
        //}

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAppointment(int id, [FromBody] UpdateAppointmentDTO appointmentDto)
        {
            if (id != appointmentDto.Id)
            {
                return BadRequest("Appointment ID mismatch.");
            }

            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
            {
                return NotFound();
            }                     
            appointment.AppointmentTakenDate = appointmentDto.AppointmentTakenDate;

            _context.Entry(appointment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return StatusCode(500, "An error occurred while updating the appointment.");
            }

            return NoContent();
        }


        [HttpPost]
        public async Task<ActionResult<Appointment>> PostAppointment(Appointment appointment)
        {

            if (!string.IsNullOrEmpty(appointment.DoctorName))
            {
                var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.Name == appointment.DoctorName);
                if (doctor != null)
                {
                    appointment.DoctorId = doctor.Id; 
                }
                else
                {
                    return BadRequest("Invalid DoctorName");
                }
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            appointment.PatientId = user.Id;
            appointment.MedicalCenterId = 2;
            appointment.AppointmentStatusId = (int)AppointmentStatusEnum.Active +(int)1;


            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAppointment", new { id = appointment.Id  }, appointment);
        }

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
