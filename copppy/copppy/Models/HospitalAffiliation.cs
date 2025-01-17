namespace AngularApi.Models
{
    public class HospitalAffiliation
    {
        public int Id { get; set; }
        public int? DoctorId { get; set; }
        public string? HospitalName { get; set; } = string.Empty;
        public string? City { get; set; } = string.Empty;
        public string? Country { get; set; } = string.Empty;
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        public Doctor? Doctor { get; set; } = null!;
    }
}
