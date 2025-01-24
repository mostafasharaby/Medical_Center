namespace AngularApi.DTO
{
    public class AppointmentDTO
    {
        public int? AppointmentId { get; set; }
        public DateTime? AppointmentDate { get; set; }
        public string? AppointmentTime { get; set; }
        public string ?AppointmentStatus { get; set; }

        public DoctorDTO? Doctor { get; set; }
        public PatientDTO? Patient { get; set; }
    }  

 }
