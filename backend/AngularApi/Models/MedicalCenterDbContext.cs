using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata;

namespace AngularApi.Models
{
    public class MedicalCenterDbContext : IdentityDbContext<Patient>
    {
        public MedicalCenterDbContext() { }
        public MedicalCenterDbContext(DbContextOptions dbContextOptions) : base(dbContextOptions) { }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<AppointmentStatus> AppointmentStatus { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<DoctorSpecialization> DoctorSpecialization { get; set; }
        public DbSet<Specialization> Specializations { get; set; }
        public DbSet<DoctorQualification> DoctorQualifications { get; set; }
        public DbSet<HospitalAffiliation> HospitalAffiliation { get; set; }        
        public DbSet<MedicalCenterDoctorAvailability> MedicalCenterDoctorAvailability { get; set; }
       
        public DbSet<MedicalCenter> MedicalCenter { get; set; }
        public DbSet<PatientReview> ClientReviews { get; set; }

    }
}
