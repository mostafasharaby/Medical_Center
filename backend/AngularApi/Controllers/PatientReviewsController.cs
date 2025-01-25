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
    public class PatientReviewsController : ControllerBase
    {
        private readonly MedicalCenterDbContext _context;

        public PatientReviewsController(MedicalCenterDbContext context)
        {
            _context = context;
        }

        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PatientReview>>> GetPatientReviews()
        {
            return await _context.PatientReviews.Include(i=>i.Patient).ToListAsync();
        }
        [HttpGet("unique-patients")]
        public async Task<ActionResult<IEnumerable<Patient>>> GetUniquePatients()
        {
            var uniquePatients = await _context.PatientReviews
                .Include(i => i.Patient) 
                .Select(pr => pr.Patient) 
                .Distinct() 
                .ToListAsync();

            return Ok(uniquePatients);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PatientReview>> GetPatientReview(int id)
        {
            var patientReview = await _context.PatientReviews.FindAsync(id);

            if (patientReview == null)
            {
                return NotFound();
            }

            return patientReview;
        }

        
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPatientReview(int id, PatientReview patientReview)
        {
            if (id != patientReview.Id)
            {
                return BadRequest();
            }

            _context.Entry(patientReview).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PatientReviewExists(id))
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
        public async Task<ActionResult<PatientReview>> PostPatientReview(PatientReview patientReview)
        {
            _context.PatientReviews.Add(patientReview);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPatientReview", new { id = patientReview.Id }, patientReview);
        }

        // DELETE: api/PatientReviews/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatientReview(int id)
        {
            var patientReview = await _context.PatientReviews.FindAsync(id);
            if (patientReview == null)
            {
                return NotFound();
            }

            _context.PatientReviews.Remove(patientReview);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PatientReviewExists(int id)
        {
            return _context.PatientReviews.Any(e => e.Id == id);
        }
    }
}
