namespace AngularApi.Models
{
    public class Appointment
    {
        public int Id { get; set; }
        public string? PatientId { get; set; }
        public int? MedicalCenterId { get; set; }
        public DateTime? ProbableStartTime { get; set; }
        public DateTime? ActualEndTime { get; set; }
        public int? AppointmentStatusId { get; set; }
        public DateTime? AppointmentTakenDate { get; set; }
        public int? AppBookingChannelId { get; set; }

        public Patient? Patient { get; set; } = null!;
        public MedicalCenter? MedicalCenter { get; set; } = null!;
        public AppointmentStatus? AppointmentStatus { get; set; } = null!;
    }
}
