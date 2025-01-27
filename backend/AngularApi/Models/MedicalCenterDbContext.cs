using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata;

namespace AngularApi.Models
{
    public class MedicalCenterDbContext : IdentityDbContext<AppUser>
    {
        public MedicalCenterDbContext() { }
        public MedicalCenterDbContext(DbContextOptions dbContextOptions) : base(dbContextOptions) { }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<AppointmentStatus> AppointmentStatus { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<DoctorSpecialization> DoctorSpecialization { get; set; }
        public DbSet<Specialization> Specializations { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<DoctorQualification> DoctorQualifications { get; set; }
        public DbSet<HospitalAffiliation> HospitalAffiliation { get; set; }        
        public DbSet<MedicalCenterDoctorAvailability> MedicalCenterDoctorAvailability { get; set; }       
        public DbSet<MedicalCenter> MedicalCenter { get; set; }
        public DbSet<PatientReview> PatientReviews { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Doctor>()
                .ToTable("Doctors");

            modelBuilder.Entity<Patient>()
              .ToTable("Patients");
        }

    }
}
